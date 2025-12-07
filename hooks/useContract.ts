"use client";

/**
 * ============================================================================
 * IOTA CONTRACT INTEGRATION HOOK
 * ============================================================================
 *
 * This hook contains ALL the contract interaction logic.
 *
 * To customize your dApp, modify the configuration section below.
 *
 * ============================================================================
 */

import { useState } from "react";
import {
  useCurrentAccount,
  useIotaClient,
  useSignAndExecuteTransaction,
  useIotaClientQuery,
} from "@iota/dapp-kit";
import { Transaction } from "@iota/iota-sdk/transactions";
import { useNetworkVariable } from "@/lib/config";
import type { IotaObjectData } from "@iota/iota-sdk/client";

// ============================================================================
// CONTRACT CONFIGURATION
// ============================================================================
// Change these values to match your Move contract

export const CONTRACT_MODULE = "burger"; // Your Move module name
export const CONTRACT_METHODS = {
  COOK: "cook",
  GET_FLAG: "get_flag",
} as const;

// ============================================================================
// DATA EXTRACTION
// ============================================================================
// Modify this to extract data from your contract's object structure

interface BurgerData {
  buns: number;
  beef: number;
  cheese: number;
  lettuce: number;
  tomato: number;
  sauce: number;
  pickles: number;
}

function getBurgerBoxFields(data: IotaObjectData): BurgerData | null {
  if (data.content?.dataType !== "moveObject") {
    console.log("Data is not a moveObject:", data.content?.dataType);
    return null;
  }

  const fields = data.content.fields as Record<string, unknown>;
  if (!fields || !fields.burger) {
    console.log("No burger fields found in object data");
    return null;
  }

  // Log the actual structure for debugging
  console.log("BurgerBox fields structure:", JSON.stringify(fields, null, 2));

  const burger = fields.burger as Record<string, unknown>;

  try {
    return {
      buns: parseInt(String(burger.buns), 10),
      beef: parseInt(String(burger.beef), 10),
      cheese: parseInt(String(burger.cheese), 10),
      lettuce: parseInt(String(burger.lettuce), 10),
      tomato: parseInt(String(burger.tomato), 10),
      sauce: parseInt(String(burger.sauce), 10),
      pickles: parseInt(String(burger.pickles), 10),
    };
  } catch (error) {
    console.error("Error parsing burger fields:", error);
    return null;
  }
}

// ============================================================================
// MAIN HOOK
// ============================================================================

export interface ContractData {
  buns: number;
  beef: number;
  cheese: number;
  lettuce: number;
  tomato: number;
  sauce: number;
  pickles: number;
}

export interface ContractState {
  isLoading: boolean;
  isPending: boolean;
  isConfirming: boolean;
  isConfirmed: boolean;
  hash: string | undefined;
  error: Error | null;
}

export interface ContractActions {
  cookBurger: (
    buns: number,
    beef: number,
    cheese: number,
    lettuce: number,
    tomato: number,
    sauce: number,
    pickles: number
  ) => Promise<void>;
  getFlag: () => Promise<void>;
  clearObject: () => void;
}

export const useContract = () => {
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address;
  const packageId = useNetworkVariable("packageId");
  const iotaClient = useIotaClient();
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction();
  const [burgerBoxId, setBurgerBoxId] = useState<string | null>(() => {
    if (typeof window !== "undefined" && currentAccount?.address) {
      return localStorage.getItem(`burgerBoxId_${currentAccount.address}`);
    }
    return null;
  });
  const [flagId, setFlagId] = useState<string | null>(() => {
    if (typeof window !== "undefined" && currentAccount?.address) {
      return localStorage.getItem(`flagId_${currentAccount.address}`);
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hash, setHash] = useState<string | undefined>();
  const [transactionError, setTransactionError] = useState<Error | null>(null);

  // Fetch burger box data
  const {
    data,
    isPending: isFetching,
    error: queryError,
    refetch,
  } = useIotaClientQuery(
    "getObject",
    {
      id: burgerBoxId!,
      options: { showContent: true, showOwner: true },
    },
    {
      enabled: !!burgerBoxId,
    }
  );

  // Extract fields
  const fields = data?.data ? getBurgerBoxFields(data.data) : null;

  // Check if object exists but data extraction failed
  const objectExists = !!data?.data;
  const hasValidData = !!fields;

  // Cook Burger
  const cookBurger = async (
    buns: number,
    beef: number,
    cheese: number,
    lettuce: number,
    tomato: number,
    sauce: number,
    pickles: number
  ) => {
    if (!packageId) return;

    try {
      setTransactionError(null);
      setHash(undefined);
      const tx = new Transaction();
      tx.moveCall({
        arguments: [
          tx.pure.u16(buns),
          tx.pure.u16(beef),
          tx.pure.u16(cheese),
          tx.pure.u16(lettuce),
          tx.pure.u16(tomato),
          tx.pure.u16(sauce),
          tx.pure.u16(pickles),
        ],
        target: `${packageId}::${CONTRACT_MODULE}::${CONTRACT_METHODS.COOK}`,
      });

      signAndExecute(
        { transaction: tx as never },
        {
          onSuccess: async ({ digest }) => {
            setHash(digest);
            setIsLoading(true);
            try {
              const { effects } = await iotaClient.waitForTransaction({
                digest,
                options: { showEffects: true },
              });
              const newBurgerBoxId = effects?.created?.[0]?.reference?.objectId;
              if (newBurgerBoxId) {
                setBurgerBoxId(newBurgerBoxId);
                if (typeof window !== "undefined" && address) {
                  localStorage.setItem(`burgerBoxId_${address}`, newBurgerBoxId);
                }
                await refetch();
                setIsLoading(false);
              } else {
                setIsLoading(false);
                console.warn("No burger box ID found in transaction effects");
              }
            } catch (waitError) {
              console.error("Error waiting for transaction:", waitError);
              setIsLoading(false);
            }
          },
          onError: (err) => {
            const error = err instanceof Error ? err : new Error(String(err));
            setTransactionError(error);
            console.error("Error:", err);
          },
        }
      );
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setTransactionError(error);
      console.error("Error cooking burger:", err);
    }
  };

  // Get Flag
  const getFlag = async () => {
    if (!burgerBoxId || !packageId) return;

    try {
      setTransactionError(null);
      const tx = new Transaction();
      tx.moveCall({
        arguments: [tx.object(burgerBoxId)],
        target: `${packageId}::${CONTRACT_MODULE}::${CONTRACT_METHODS.GET_FLAG}`,
      });

      signAndExecute(
        { transaction: tx as never },
        {
          onSuccess: async ({ digest }) => {
            setHash(digest);
            setIsLoading(true);
            try {
              const { effects } = await iotaClient.waitForTransaction({
                digest,
                options: { showEffects: true },
              });
              const newFlagId = effects?.created?.[0]?.reference?.objectId;
              if (newFlagId) {
                setFlagId(newFlagId);
                if (typeof window !== "undefined" && address) {
                  localStorage.setItem(`flagId_${address}`, newFlagId);
                }
                setIsLoading(false);
              } else {
                setIsLoading(false);
                console.warn("No flag ID found in transaction effects");
              }
            } catch (waitError) {
              console.error("Error waiting for transaction:", waitError);
              setIsLoading(false);
            }
          },
          onError: (err) => {
            const error = err instanceof Error ? err : new Error(String(err));
            setTransactionError(error);
            console.error("Error:", err);
          },
        }
      );
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setTransactionError(error);
      console.error("Error getting flag:", err);
    }
  };

  const contractData: ContractData | null = fields;

  const clearObject = () => {
    setBurgerBoxId(null);
    setFlagId(null);
    setTransactionError(null);
    if (typeof window !== "undefined" && address) {
      localStorage.removeItem(`burgerBoxId_${address}`);
      localStorage.removeItem(`flagId_${address}`);
    }
  };

  const actions: ContractActions = {
    cookBurger,
    getFlag,
    clearObject,
  };

  const contractState: ContractState = {
    isLoading: isLoading,
    isPending,
    isConfirming: false,
    isConfirmed: !!hash && !isLoading && !isPending,
    hash,
    error: queryError || transactionError,
  };

  return {
    data: contractData,
    actions,
    state: contractState,
    burgerBoxId,
    flagId,
    objectExists,
    hasValidData,
    isFetching,
  };
};
