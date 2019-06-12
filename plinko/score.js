const output = [];
const k = 100;

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  output.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
  const [testSet, trainingSet] = splitDataset(output, 10);
  testSet.forEach(item => {
    const bucket = knn(trainingSet, item[0]);
    console.log(bucket, item[3]);
  });
}

function knn(data, point) {
  return _.chain(data)
    .map(row => [distance(row[0], point), row[3]])
    .sortBy(row => row[0])
    .slice(0, k)
    .countBy(row => row[1])
    .toPairs()
    .sortBy(row => row[1])
    .last()
    .first()
    .parseInt()
    .value();
}

function distance(point, predictionPoint) {
	return Math.abs(point - predictionPoint);
}

function splitDataset(data, testCount) {
  const shuffled = _.shuffle(data);

  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);

  return [testSet, trainingSet];
}

