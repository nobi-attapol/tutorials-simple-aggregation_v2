import {SubstrateEvent} from "@subql/types";
import {StakingReward} from "../types";
import {SumReward} from "../types";
import {Balance} from "@polkadot/types/interfaces";

export async function handleStakingRewarded(event: SubstrateEvent): Promise<void> {
    const {event: {data: [account, newReward]}} = event;
    const entity = new StakingReward(`${event.block.block.header.number}-${event.idx.toString()}`);

    entity.accountId = account.toString();
    entity.balance = (newReward as Balance).toBigInt();
    entity.date = event.block.timestamp;
    // entity.blockHeight = event.block.block.header.number.toNumber();

    await entity.save();
}

function createSumReward(accountId: string): SumReward {
    const entity = new SumReward(accountId);
    entity.totalReward = BigInt(0);
    return entity;
}

export async function handleSumReward(event: SubstrateEvent): Promise<void> {
    await handleSumRewarded(event)
}

export async function handleStakingReward(event: SubstrateEvent): Promise<void> {
    await handleStakingRewarded(event)
}

export async function handleSumRewarded(event: SubstrateEvent): Promise<void> {
    const {event: {data: [account, newReward]}} = event;
    let entity = await SumReward.get(account.toString());

    if (entity === undefined){
        entity = createSumReward(account.toString());
    }

    entity.totalReward = entity.totalReward + (newReward as Balance).toBigInt();
    entity.blockheight = event.block.block.header.number.toNumber();
    await entity.save();
}