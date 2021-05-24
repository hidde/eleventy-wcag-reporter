function countSCOnce(accumulator, current) {

  for (let i = 0; i < accumulator.length; i++) {
    if ( accumulator[i].data.sc === current.data.sc) {
      return accumulator
    }
  }

  accumulator.push(current);

  return accumulator
}

module.exports = countSCOnce;