import { expect } from 'chai';
import { Castle } from '../src/lib';

describe('asd', () => {
  it('asd', () => {
    const castle = new Castle({ apiSecret: '', apiUrl: '' });
    expect(castle).to.have.property('identify');
    expect(castle).to.have.property('track');
  });
});
