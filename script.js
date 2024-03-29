function initArr(len) {
    // initialises an arr of length len, values ranging (0,1)
    let arr = [];

    for (let i=0;i<len;i++) {
        arr.push(Math.random());
    }

    displayArr(arr);

    return arr;
}

function buttonInitArray() {
    // inits array from button press
    arr = [];
    let len = parseInt(document.getElementById("length").value);
    for (let i=0;i<len;i++) {
        arr.push(Math.random());
    }

    displayArr(arr);

    return arr;
}

function displayArr(arr) {
    // displays the current array on the root div
    const element = document.getElementById("root");

    const root = document.createElement("div");
    root.style.display = 'flex';
    root.style.alignItems = 'flex-end';
    root.style.height = '100%';
    for (let i=0;i<arr.length;i++) {
        const newDiv = document.createElement('div');
        newDiv.style.height = Math.floor(element.clientHeight*arr[i]) + "px";
        newDiv.style.width = element.clientWidth/arr.length + "px";
        newDiv.className = "item"
        if (arr.length < 600) {
            newDiv.style.border = "1px solid black";
        }
        root.appendChild(newDiv);
    }

    if (element.firstChild) {
        element.replaceChild(root, element.firstChild);
    } else {
        element.appendChild(root);
    }
    
}

function highlightActive(_class, ...index) {
    // highlights the index^th element by giving it the className _class
    let items = document.querySelectorAll('.item');
    items.forEach(element => {
        element.classList.remove(_class);
    });

    index.forEach(i => {
        try {
            items[i].classList.add(_class)
        }
        catch {
            //nothing
        }
    });
}

function swap(a, b) {
    // swaps a and b
    return [b, a]
}

function sleep(time) {
    // delays execution by time (ms)
    if (stop) {
        throw Error("Stopped")
    } else {
        return new Promise(res => setTimeout(res, time));
    }
    
}

async function selectionSort(arr) {
    // sorts array in ascending order using selection sort
    for (let i=0;i < arr.length-1;i++) {
        let minimum_index = i;
        for (let j=i+1;j<arr.length;j++) { // look for the minimum element
            highlightActive('active', j);
            if (arr[j] < arr[minimum_index]) {
                minimum_index = j;
                highlightActive('swap', minimum_index);
            }
            await sleep(DELAY);
        }

        [arr[i], arr[minimum_index]] = swap(arr[i], arr[minimum_index]); // swap minimum element with current 
        displayArr(arr);
        // highlightActive('swap', i, minimum_index);
    }
    displayArr(arr);
    return arr
}

async function bubbleSort(arr) {
    // sorts array in ascending order using bubbleSort
    for (let i=0;i<arr.length - 1;i++) {
        for (let j=0; j<arr.length - 1 - i; j++) {
            if (arr[j] > arr[j+1]) {
                [arr[j], arr[j+1]] = swap(arr[j], arr[j+1]); // if left element bigger than current, swap
            }
            displayArr(arr);
            highlightActive('active', j);
            await sleep(DELAY);
        }
    }
    return arr;
}

// THE ACTUAL MERGESORT. BUT FOR VISUALISATION PURPOSES, WE ARE NOT USING THIS
// async function merge(left, right) {
//     let left_cursor = 0;
//     let right_cursor = 0;
//     let merged = [];

//     while (left_cursor < left.length && right_cursor < right.length) {
//         if (left[left_cursor] < right[right_cursor]) {
//             merged.push(left[left_cursor]);
//             left_cursor++;
//         } else {
//             merged.push(right[right_cursor]);
//             right_cursor++;
//         }
//     }

//     for (let i=left_cursor;i < left.length; i++) {
//         merged.push(left[i]);
//     }

//     for (let i=right_cursor;i < right.length; i++) {
//         merged.push(right[i]);
//     }

//     return merged;
// }

// async function mergeSort(arr) {
//     let middle = Math.floor(arr.length/2);
//     let left_arr = arr.slice(0,middle);
//     let right_arr = arr.slice(middle, arr.length);

//     if (arr.length > 1) {
//         left_arr = await mergeSort(left_arr);
//         right_arr = await mergeSort(right_arr);
//     }

//     await sleep(0.01);
    
//     let merged = await merge(left_arr, right_arr);
//     displayArr(merged);
//     return merged;
// }

async function mergeSort(arr, start=0, end=arr.length-1) {
    // sorts array in ascending order using mergesort algorithm
    async function merge(arr, left_start, left_end, right_start, right_end) {
        // merge/sort 2 parts of the array 
        let left_cursor = left_start;
        let right_cursor = right_start;
        let merged_arr = [];
    
        while (left_cursor <= left_end && right_cursor <= right_end) {
            if (arr[left_cursor] < arr[right_cursor]) {
                merged_arr.push(arr[left_cursor]);
                left_cursor++;
            } else {
                merged_arr.push(arr[right_cursor]);
                right_cursor++;
            }
            await sleep(DELAY);
            highlightActive('active', left_cursor, right_cursor);
        }
    
        for (let i=left_cursor; i<=left_end;i++) {
            merged_arr.push(arr[i]);
            await sleep(DELAY);
        }
    
        for (let i=right_cursor; i<=right_end;i++) {
            merged_arr.push(arr[i]);
            await sleep(DELAY);
        }
    
        arr = arr.slice(0, left_start).concat(merged_arr).concat(arr.slice(right_end + 1));
        displayArr(arr);
        return arr;
    }
    
    if (start >= end) {
        return arr
    }

    let middle = Math.floor((end+start)/2);

    if (end - start > 1) {
        // let arr1 =  mergeSort(arr, start, middle);
        // let arr2 =  mergeSort(arr, middle+1, end);
        // const vals = await Promise.all([arr1, arr2]);
        // arr = vals[0].slice(0, middle + 1).concat(vals[1].slice(middle + 1));
        let arr1 = await mergeSort(arr, start, middle);
        let arr2 = await mergeSort(arr, middle+1, end);
        arr = arr1.slice(0, middle + 1).concat(arr2.slice(middle + 1));
        displayArr(arr);
    }
    
    arr =  await merge(arr, start, middle, middle+1, end);
    displayArr(arr);
    return arr;
}

async function insertionSort(arr){
    // sort arr in ascending order using insertion sort
    for (let i=0; i<arr.length; i++) {
        let j = i;
        while (j > 0 && arr[j-1]>arr[j]){
            [arr[j-1], arr[j]] = swap(arr[j-1], arr[j]); // if left element is bigger, swap
            displayArr(arr);
            highlightActive('active', j);
            j--;
            await sleep(DELAY);
        }
    }

    displayArr(arr);
    return arr;
}

async function quickSort(arr, start=0, end=arr.length-1) {
    async function partition(arr, start, end) {
        let pivotValue = arr[end]; // pivot

        let pivotIndex = start; // index of starting element
        for (let j=start; j <= end-1; j++) {
            // if current element smaller than pivot
            if (arr[j] < pivotValue) {
                [arr[pivotIndex], arr[j]] = swap(arr[pivotIndex], arr[j]);
                pivotIndex++; // increase starting index
            }

            displayArr(arr);
            highlightActive('active', j);
            highlightActive('swap', end); // highlighting pivot

            await sleep(DELAY);
        }

        [arr[pivotIndex], arr[end]] = swap(arr[pivotIndex], arr[end]); // swap pivot and highest value number
        
        highlightActive('swap', pivotIndex, end);
        return pivotIndex;

    }
    
    if (start < end) {
        // this is technically unhealthy for normal promises. We would use a Promise.all here. But this is sorting
        // we want to single thread everything
        pi = await partition(arr, start, end);
        arr = await quickSort(arr, start, pi - 1);
        arr = await quickSort(arr, pi + 1, end);
    }

    displayArr(arr);
    return arr;
}

async function sortBy(f) {
    stop = false;
    DELAY = parseInt(document.getElementById('delay').value || 0);

    try {
        arr = await f(arr);
    } catch(e) {
        console.log("Execution stopped");
    }
    
}

let arr = initArr(50);
let stop = false;
displayArr(arr);
document.getElementById('stop').addEventListener('click', () => {stop = true});


