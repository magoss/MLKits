const output = [];

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  output.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
  const testSetSize = 100;
  const [testSet, trainingSet] = splitDataset(minMax(output, 3), testSetSize);

  _.range(1, 2).forEach(k => {
    const accuracy = _.chain(testSet)
      .filter(testPoint => knn(trainingSet, _.initial(testPoint), k) === testPoint[3])
      .size()
      .divide(testSetSize)
      .value();
  
    console.log(`Accuracy for k = ${k}: ${accuracy}`);
  });
}

function knn(data, point, k) {
  return _.chain(data)
    .map(row => [calculateDistance(_.initial(row), point), _.last(row)])
    .sortBy(row => _.first(row))
    .slice(0, k)
    .countBy(row => _.last(row))
    .toPairs()
    .sortBy(row => _.last(row))
    .last()
    .first()
    .parseInt()
    .value();
}

function calculateDistance(pointA, pointB) {
  return _.chain(pointA)
    .zip(pointB)
    .map(([a, b]) => Math.abs(a - b) ** 2)
    .sum()
    .value() ** 0.5;
}

function splitDataset(data, testCount) {
  const shuffled = _.shuffle(data);

  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);

  return [testSet, trainingSet];
}

function minMax(data, featureCount) {
  const clonedData = _.cloneDeep(data);

  for (let i = 0; i < featureCount; i++) {
    const column = clonedData.map(row => row[i]);
    const min = _.min(column);
    const max = _.max(column);

    for (let j = 0; j < clonedData.length; j++) {
      clonedData[j][i] = (clonedData[j][i] - min) / (max - min);
    }
  }

  return clonedData;
}
