module pizza_box::burger {
    use std::bcs;
    use iota::object::{Self, UID};
    use iota::tx_context;
    use iota::transfer;

    public struct Burger has store {
        buns: u16,
        beef: u16,
        cheese: u16,
        lettuce: u16,
        tomato: u16,
        sauce: u16,
        pickles: u16,
    }

    public struct BurgerBox has key, store {
        id: UID,
        burger: Burger,
    }

    public struct Flag has key, store {
        id: UID,
        user: address
    }

    const EMamaMiaNonBene: u64 = 0;

    #[allow(lint(self_transfer))]
    public fun cook(buns: u16, beef: u16, cheese: u16, lettuce: u16, tomato: u16, sauce: u16, pickles: u16, ctx: &mut tx_context::TxContext) {
        let sender = tx_context::sender(ctx);

        let b = Burger {
            buns,
            beef,
            cheese,
            lettuce,
            tomato,
            sauce,
            pickles,
        };
    
        transfer::public_transfer(BurgerBox { id: object::new(ctx), burger: b }, sender);
    }

    #[allow(lint(self_transfer))]
    public fun get_flag(burgerbox: &BurgerBox, ctx: &mut tx_context::TxContext) {
        // This is where the Chef comes in to judge...
        assert!(bcs::to_bytes(&burgerbox.burger) == x"0200010003000400050006000800", EMamaMiaNonBene);
        transfer::public_transfer(Flag {
            id: object::new(ctx),
            user: tx_context::sender(ctx)
        }, tx_context::sender(ctx));
    }    
}