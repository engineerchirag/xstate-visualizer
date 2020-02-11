import {generateAdAccountMachine} from './../machines/adAccount';
const examples = generateAdAccountMachine({
  initial: 'DRAFT',
  context: {
    paymentType: 'PREPAID',
  }
});

export { examples };
