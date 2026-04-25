export default function shuffle(arr) {
    const newArr = [...arr]
    let currIdx = newArr.length - 1

    while (currIdx > 0) {
        let randIdx = Math.floor(Math.random() * currIdx);

        [newArr[currIdx], newArr[randIdx]] = [newArr[randIdx], newArr[currIdx]];
        currIdx--
    }

    return newArr
}