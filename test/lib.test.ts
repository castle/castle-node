import { expect } from 'chai';
import { Castle } from '../index';

describe('asd', () => {
  it('asd', () => {
    const castle = new Castle({ apiSecret: '' });
    expect(castle).to.have.property('authenticate');
    expect(castle).to.have.property('track');
  });
});
