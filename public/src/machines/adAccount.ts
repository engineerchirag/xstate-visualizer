/* eslint-disable sort-keys */
import { Machine, assign } from 'xstate';

export const AD_ACCOUNT_STATE = {
    DRAFT: {
        key: 'DRAFT',
    },
    PAYMENT_IN_REVIEW: {
        key: 'PAYMENT_IN_REVIEW',
    },
    IN_REVIEW: {
        key: 'IN_REVIEW',
    },
    REJECTED: {
        key: 'REJECTED',
    },
    APPROVED: {
        key: 'APPROVED',
    },
    ON_HOLD: {
        key: 'ON_HOLD',
    },
};

export const AD_ACCOUNT_ACTION = {
    APPROVE: {
        key: 'APPROVE',
    },
    ON_HOLD: {
        key: 'ON_HOLD',
    },
    REJECT: {
        key: 'REJECT',
    },
    SEND_FOR_BIZFIN: {
        key: 'SEND_FOR_BIZFIN',
    },
    SAVE: {
        key: 'SAVE',
    },
    REQUEST: {
        key: 'SAVE',
    },
};

export const generateAdAccountMachine = (config: any) => {
    const machineStateConfig = {
        id: 'adAccount',
        initial: AD_ACCOUNT_STATE.DRAFT.key,
        context: {
            paymentType: 'AB',
        },
        states: {
            [AD_ACCOUNT_STATE.DRAFT.key]: {
                on: {
                    SAVE: AD_ACCOUNT_STATE.DRAFT.key,
                    REQUEST: AD_ACCOUNT_STATE.IN_REVIEW.key,
                },
            },
            [AD_ACCOUNT_STATE.ON_HOLD.key]: {
                on: {
                    REQUEST: AD_ACCOUNT_STATE.IN_REVIEW.key,
                },
            },
            [AD_ACCOUNT_STATE.IN_REVIEW.key]: {
                on: {
                    APPROVE: {
                        target: AD_ACCOUNT_STATE.APPROVED.key,
                        cond: 'isPrepaid',
                    },
                    ON_HOLD: AD_ACCOUNT_STATE.ON_HOLD.key,
                    REJECT: AD_ACCOUNT_STATE.REJECTED.key,
                    SEND_FOR_BIZFIN: {
                        target: AD_ACCOUNT_STATE.PAYMENT_IN_REVIEW.key,
                        cond: 'isPostpaid',
                    },
                },
            },
            [AD_ACCOUNT_STATE.PAYMENT_IN_REVIEW.key]: {
                on: {
                    REJECT: AD_ACCOUNT_STATE.IN_REVIEW.key,
                    APPROVE: AD_ACCOUNT_STATE.APPROVED.key,
                },
            },
            [AD_ACCOUNT_STATE.REJECTED.key]: {
                type: 'final',
            },
            [AD_ACCOUNT_STATE.APPROVED.key]: {
                type: 'final',
            },
        },
        ...config,
    };
    return Machine(machineStateConfig, {
        guards: {
            isPrepaid: (context: any, event: any) => {
                return context.paymentType === 'PREPAID';
            },
            isPostpaid: (context: any, event: any) => {
                return context.paymentType !== 'PREPAID';
            },
        },
        actions: {
            updatePaymentType: assign({
                paymentType: (context: any, event: any) => {
                    return event.paymentType || context.paymentType;
                },
            }),
        },
    });
};
