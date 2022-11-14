import { ControlValueCalculator } from '../ControlValueCalculator';

/**
 * Test helper for testing callbacks.
 * Call this after first creating the control value store, but before any set calls
 */
function expectGet$(controlValues, key, done, ...callbacks) {
  let callCount = 0;

  controlValues.get$(key)
    .subscribe((controlValue) => {
      if (callCount < callbacks.length) {
        callbacks[callCount](controlValue);
      }

      ++callCount;

      if (callCount === callbacks.length) {
        done();
      } else if (callCount > callbacks.length) {
        console.error('Unexpected callback with value', controlValue);
        done.fail();
      }
    }, done.fail);
}

function expectGetValue$(controlValues, key, done, ...values) {
  let callCount = 0;

  controlValues.getValue$(key)
    .subscribe((value) => {
      if (callCount < values.length) {
        expect(value).toBe(values[callCount]);
      }

      ++callCount;

      if (callCount === values.length) {
        done();
      } else if (callCount > values.length) {
        console.error('Unexpected callback with value', value);
        done.fail();
      }
    }, done.fail);
}

describe('AnnualConsumptionQuantityTarget', () => {
  describe('with no initial values', () => {
    it('get$ should return object with null value', (done) => {
      const controlValues = new ControlValueCalculator({});

      expectGet$(controlValues, 'annualConsumptionQuantityTarget', done, (controlValue) => {
        expect(controlValue).toBeDefined();
        expect(controlValue.value).toBeNull();
      });
    });

    it('getValue$ should return null', (done) => {
      const controlValues = new ControlValueCalculator({});

      expectGetValue$(controlValues, 'annualConsumptionQuantityTarget', done, null);
    });
  });

  describe('with initial daysInYear', () => {
    describe('with initial dailyConsumptionQuantityTarget', () => {
      it('should not calculate', (done) => {
        const controlValues = new ControlValueCalculator({
          daysInYear: { value: 365, locked: false },
          dailyConsumptionQuantityTarget: { value: 10, locked: false }
        });

        expectGetValue$(controlValues, 'annualConsumptionQuantityTarget', done, null);
      });
    });

    describe('then setting explicit dailyConsumptionQuantityTarget', () => {
      it('should calculate', (done) => {
        const controlValues = new ControlValueCalculator({
          daysInYear: { value: 365, locked: false },
        });

        expectGetValue$(controlValues, 'annualConsumptionQuantityTarget', done, null, 3650);

        controlValues.setValue('dailyConsumptionQuantityTarget', 10);
      });
    });

    describe('with unlocked initial value', () => {
      it('get$ should return initial value and unlocked state', (done) => {
        const controlValues = new ControlValueCalculator({
          daysInYear: { value: 365, locked: false },
          annualConsumptionQuantityTarget: { value: 100, locked: false },
        });

        expectGet$(controlValues, 'annualConsumptionQuantityTarget', done, (controlValue) => {
          expect(controlValue).toBeDefined();
          expect(controlValue.value).toBe(100);
          expect(controlValue.locked).toBe(false);
        });
      });

      describe('with initial dailyConsumptionQuantityTarget', () => {
        it('should not calculate', (done) => {
          const controlValues = new ControlValueCalculator({
            daysInYear: { value: 365, locked: false },
            annualConsumptionQuantityTarget: { value: 100, locked: false },
            dailyConsumptionQuantityTarget: { value: 10, locked: false }
          });

          expectGetValue$(controlValues, 'annualConsumptionQuantityTarget', done, 100);
        });
      });

      describe('then setting explicit dailyConsumptionQuantityTarget', () => {
        it('should calculate', (done) => {
          const controlValues = new ControlValueCalculator({
            daysInYear: { value: 365, locked: false },
            annualConsumptionQuantityTarget: { value: 100, locked: false },
          });

          expectGetValue$(controlValues, 'annualConsumptionQuantityTarget', done, 100, 3650);

          controlValues.setValue('dailyConsumptionQuantityTarget', 10);
        });
      });

      describe('then explicitly locking', () => {
        describe('then setting explicit dailyConsumptionQuantityTarget', () => {
          it('should not calculate', (done) => {
            const controlValues = new ControlValueCalculator({
              daysInYear: { value: 365, locked: false },
              annualConsumptionQuantityTarget: { value: 100, locked: false },
            });

            expectGetValue$(controlValues, 'annualConsumptionQuantityTarget', done, 100);

            controlValues.setLocked('annualConsumptionQuantityTarget', true);
            controlValues.setValue('dailyConsumptionQuantityTarget', 10);
          });
        });
      });
    });

    describe('with locked initial value', () => {
      it('get$ should return initial value and locked state', (done) => {
        const controlValues = new ControlValueCalculator({
          daysInYear: { value: 365, locked: false },
          annualConsumptionQuantityTarget: { value: 100, locked: true },
        });

        expectGet$(controlValues, 'annualConsumptionQuantityTarget', done, (controlValue) => {
          expect(controlValue).toBeDefined();
          expect(controlValue.value).toBe(100);
          expect(controlValue.locked).toBe(true);
        });
      });

      describe('then setting explicit dailyConsumptionQuantityTarget', () => {
        it('should not calculate', (done) => {
          const controlValues = new ControlValueCalculator({
            daysInYear: { value: 365, locked: false },
            annualConsumptionQuantityTarget: { value: 100, locked: true },
          });

          expectGetValue$(controlValues, 'annualConsumptionQuantityTarget', done, 100);

          controlValues.setValue('dailyConsumptionQuantityTarget', 10);
        });

        describe('then unlocking', () => {
          it('should calculate', (done) => {
            const controlValues = new ControlValueCalculator({
              daysInYear: { value: 365, locked: false },
              annualConsumptionQuantityTarget: { value: 100, locked: true },
            });

            expectGetValue$(controlValues, 'annualConsumptionQuantityTarget', done, 100, 3650);

            controlValues.setLocked('annualConsumptionQuantityTarget', false);
            controlValues.setValue('dailyConsumptionQuantityTarget', 10);
          });
        });
      });

      describe('then unlocking', () => {
        describe('then setting explicit dailyConsumptionQuantityTarget', () => {
          it('should calculate', (done) => {
            const controlValues = new ControlValueCalculator({
              daysInYear: { value: 365, locked: false },
              annualConsumptionQuantityTarget: { value: 100, locked: true },
            });

            expectGetValue$(controlValues, 'annualConsumptionQuantityTarget', done, 100, 3650);

            controlValues.setLocked('annualConsumptionQuantityTarget', false);
            controlValues.setValue('dailyConsumptionQuantityTarget', 10);
          });
        });
      });
    });
  });
});
