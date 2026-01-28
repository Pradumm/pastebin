export const getNow = (req) => {
  if (process.env.TEST_MODE === '1') {
    const testNow = req.headers['x-test-now-ms'];
    console.log('TEST_MODE=1 active, x-test-now-ms:', testNow);
    if (testNow) {
      return new Date(Number(testNow));
    }
  }
  return new Date();
};
