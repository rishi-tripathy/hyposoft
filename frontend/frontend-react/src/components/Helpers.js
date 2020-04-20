export const jsonToHumanText = (obj) => {
  // get keys
  let keys = []
  for (let k in obj) keys.push(k);

  // create an array of [key / value / key / value / ....]
  let output = []
  for (let i = 0; i < keys.length; i++) {
    output.push(keys[i])
    output.push('   ' + obj[keys[i]])
  }

  //create a string representation of output array
  let outText = '\n'
  for (let i = 0; i < output.length; i++) {
    outText = outText + output[i] + '\n'
  }

  return outText
}