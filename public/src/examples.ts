import {generateAdAccountMachine} from './../../../Pegasus/src/shared/machines/adAccount';
const examples = `const fetchMachine = ${generateAdAccountMachine({
  initial: 'IN_REVIEW',
  context: {
    paymentType: 'PREPAID',
  }
})}`;

export { examples };
