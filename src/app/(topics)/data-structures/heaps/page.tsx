"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { ReactNode } from "react";

const KO = {
  breadcrumb: {
    home: "cs-canvas",
    parent: "data-structures",
    current: "heaps",
  },
  hero: {
    title: "Heaps",
    desc: "최댓값(또는 최솟값)을 항상 빠르게 꺼낼 수 있는 완전 이진 트리.\n우선순위 큐의 표준 구현 — 다익스트라, 작업 스케줄링, top-K 문제의 기반.",
    tags: ["Min-Heap", "Max-Heap", "Heapify", "우선순위 큐", "Heap Sort"],
  },
  sections: [
    {
      number: "01",
      title: "힙 속성과 완전 이진 트리",
      desc: "Max-Heap: 모든 부모 ≥ 자식. Min-Heap: 모든 부모 ≤ 자식. 형제 간 순서는 보장되지 않음 — 루트만 최대/최소임을 보장. 완전 이진 트리 형태라 배열로 표현 가능.",
    },
    {
      number: "02",
      title: "배열 표현 — 포인터 불필요",
      desc: "노드 인덱스 i의 부모 = (i-1)/2, 왼쪽 자식 = 2i+1, 오른쪽 자식 = 2i+2. 완전 이진 트리이므로 빈 공간 없이 배열에 꽉 채울 수 있음.",
    },
    {
      number: "03",
      title: "Insert — sift-up",
      desc: "1) 배열 끝에 새 원소를 추가 (완전 이진 트리 유지). 2) 부모와 비교, 힙 속성 깨지면 swap (sift-up). 3) 루트 도달 또는 속성 만족까지 반복. O(log n).",
    },
    {
      number: "04",
      title: "Extract-Max (Pop) — sift-down",
      desc: "1) 루트를 반환값으로 저장. 2) 배열 마지막 원소를 루트로 이동. 3) 더 큰 자식과 swap (sift-down). 4) 자식보다 크거나 leaf 도달까지 반복. O(log n).",
    },
    {
      number: "05",
      title: "Heapify — O(n) 빌드",
      desc: "n개 원소를 한꺼번에 힙으로 만들기. 한 번에 하나씩 insert하면 O(n log n). 그러나 마지막 비-leaf 노드부터 sift-down하면 O(n) — 깊이가 깊을수록 노드 수가 적기 때문.",
    },
    {
      number: "06",
      title: "활용 — 우선순위 큐, Heap Sort, Top-K",
      desc: "우선순위 큐의 표준 구현. Heap Sort: max-heap을 만들고 루트를 마지막과 swap하며 크기 줄이기, O(n log n) + O(1) 공간. Top-K: min-heap에 K개만 유지하며 O(n log k).",
    },
  ],
  arrayRep: {
    title: "Min-Heap 배열 표현",
    tree: `        1
       / \\
      3   5
     / \\ / \\
    4  8 6  9`,
    array: "[1, 3, 5, 4, 8, 6, 9]",
    indices: [
      "i=0: 1 (root)",
      "i=1: 3, parent=(1-1)/2=0 ✓",
      "i=2: 5, parent=(2-1)/2=0 ✓",
      "i=3: 4, parent=(3-1)/2=1 ✓",
      "i=4: 8, parent=(4-1)/2=1 ✓",
      "i=5: 6, parent=(5-1)/2=2 ✓",
      "i=6: 9, parent=(6-1)/2=2 ✓",
    ],
  },
  insert: {
    title: "Insert(2) — Min-Heap에 삽입",
    steps: [
      { state: "[1, 3, 5, 4, 8, 6, 9]", action: "끝에 2 추가" },
      { state: "[1, 3, 5, 4, 8, 6, 9, 2]", action: "2(i=7) vs parent 4(i=3): 2 < 4 → swap" },
      { state: "[1, 3, 5, 2, 8, 6, 9, 4]", action: "2(i=3) vs parent 3(i=1): 2 < 3 → swap" },
      { state: "[1, 2, 5, 3, 8, 6, 9, 4]", action: "2(i=1) vs parent 1(i=0): 2 > 1 → 종료" },
    ],
  },
  extract: {
    title: "Extract-Min — Min-Heap에서 루트 추출",
    steps: [
      { state: "[1, 3, 5, 4, 8, 6, 9]", action: "루트 1 저장, 마지막 9를 루트로" },
      { state: "[9, 3, 5, 4, 8, 6]", action: "9 vs min(3,5) = 3: swap" },
      { state: "[3, 9, 5, 4, 8, 6]", action: "9(i=1) vs min(4,8) = 4: swap" },
      { state: "[3, 4, 5, 9, 8, 6]", action: "9(i=3)는 leaf → 종료. 결과: 1 반환" },
    ],
  },
  complexity: {
    title: "복잡도",
    headers: ["연산", "복잡도", "비고"],
    rows: [
      ["Find-Min/Max (Peek)", "O(1)", "루트 그대로"],
      ["Insert", "O(log n)", "Sift-up"],
      ["Extract-Min/Max", "O(log n)", "Sift-down"],
      ["Decrease-Key", "O(log n)", "Sift-up from index"],
      ["Build-Heap", "O(n)", "Heapify 알고리즘"],
      ["Heap Sort", "O(n log n)", "Build + n × Extract"],
    ],
  },
  usage: {
    title: "힙의 대표적 활용",
    items: [
      { name: "우선순위 큐 (Priority Queue)", desc: "OS의 프로세스 스케줄링, 이벤트 시뮬레이션. PUSH/POP을 모두 O(log n)으로." },
      { name: "Dijkstra 최단 경로", desc: "현재까지 비용이 최소인 노드를 빠르게 추출. Min-Heap 필수." },
      { name: "Heap Sort", desc: "Max-Heap 빌드 → 루트와 마지막 swap → 크기 줄이며 반복. O(n log n) + O(1) 공간." },
      { name: "Top-K 문제", desc: "K개 중 가장 작은 것보다 큰 새 원소만 push. Min-Heap 크기 K → O(n log k)." },
      { name: "Median 유지", desc: "Max-Heap(좌반) + Min-Heap(우반) 두 개로 실시간 중앙값을 O(log n)에 유지." },
      { name: "Merge K Sorted Lists", desc: "각 리스트의 head를 Min-Heap에 → 매번 최솟값 pop 후 다음 원소 push. O(N log k)." },
    ],
  },
  vsBST: {
    title: "Heap vs BST",
    headers: ["", "Binary Heap", "Binary Search Tree"],
    rows: [
      ["순서 보장", "루트만 최대/최소", "전체 정렬 (in-order)"],
      ["Find-Min/Max", "O(1)", "O(log n)"],
      ["Search (임의 키)", "O(n)", "O(log n)"],
      ["메모리", "배열, 포인터 X", "노드 + 포인터"],
      ["용도", "우선순위만 필요할 때", "정렬·범위 검색 필요할 때"],
    ],
  },
  heapImpl: {
    title: "Min-Heap 전체 구현 — Java",
    intro: "ArrayList로 백킹 스토어를 두고, 인덱스 산술로 부모/자식을 계산. siftUp / siftDown이 핵심 빌딩 블록.",
    code: `import java.util.ArrayList;
import java.util.List;

class MinHeap {
    private final List<Integer> data = new ArrayList<>();

    // 인덱스 산술 — 핵심 공식
    private int parent(int i) { return (i - 1) / 2; }
    private int left(int i)   { return 2 * i + 1; }
    private int right(int i)  { return 2 * i + 2; }

    public int size()       { return data.size(); }
    public boolean isEmpty(){ return data.isEmpty(); }

    // Peek — O(1)
    public int peek() {
        if (data.isEmpty()) throw new IllegalStateException("empty heap");
        return data.get(0);
    }

    // Insert — O(log n)
    public void insert(int key) {
        data.add(key);              // 1) 배열 끝에 추가
        siftUp(data.size() - 1);    // 2) 위로 올리며 힙 속성 복원
    }

    // Extract-Min — O(log n)
    public int extractMin() {
        if (data.isEmpty()) throw new IllegalStateException("empty heap");
        int min = data.get(0);
        int last = data.remove(data.size() - 1);
        if (!data.isEmpty()) {
            data.set(0, last);      // 마지막을 루트로
            siftDown(0);            // 아래로 내리며 복원
        }
        return min;
    }

    // siftUp: 자식이 부모보다 작으면 swap, 위로 반복
    private void siftUp(int i) {
        while (i > 0) {
            int p = parent(i);
            if (data.get(i) >= data.get(p)) break;   // 힙 속성 OK
            swap(i, p);
            i = p;
        }
    }

    // siftDown: 부모가 더 작은 자식보다 크면 swap, 아래로 반복
    private void siftDown(int i) {
        int n = data.size();
        while (true) {
            int l = left(i), r = right(i), smallest = i;
            if (l < n && data.get(l) < data.get(smallest)) smallest = l;
            if (r < n && data.get(r) < data.get(smallest)) smallest = r;
            if (smallest == i) break;                 // 더 내려갈 곳 없음
            swap(i, smallest);
            i = smallest;
        }
    }

    private void swap(int i, int j) {
        int tmp = data.get(i);
        data.set(i, data.get(j));
        data.set(j, tmp);
    }
}`,
    keypoints: [
      "siftUp은 '부모보다 작으면 swap'을 위로 반복. siftDown은 더 작은 자식과 swap을 아래로 반복.",
      "siftDown에서 양쪽 자식 중 더 작은 쪽과 swap해야 함 — 한쪽만 보면 힙 속성 깨질 수 있음.",
      "삽입은 끝에 push → siftUp. 추출은 루트 저장 → 마지막을 루트로 → siftDown.",
      "Max-Heap이 필요하면 비교 부호만 뒤집기 (`>` ↔ `<`). 또는 값에 -1을 곱해서 Min-Heap 그대로 쓰기.",
    ],
  },
  buildHeapImpl: {
    title: "Build-Heap — O(n)으로 한 번에 만들기",
    intro: "n개의 원소를 하나씩 insert하면 O(n log n). 그러나 배열 그대로 두고 마지막 비-leaf 노드부터 siftDown을 반복하면 O(n).",
    code: `// 이미 채워진 배열로부터 힙 빌드 — O(n)
public static void buildHeap(int[] arr) {
    int n = arr.length;
    // 마지막 부모 노드 인덱스 = n/2 - 1
    // 그 위로 거꾸로 가며 siftDown
    for (int i = n / 2 - 1; i >= 0; i--) {
        siftDownArr(arr, i, n);
    }
}

private static void siftDownArr(int[] arr, int i, int n) {
    while (true) {
        int l = 2 * i + 1, r = 2 * i + 2, smallest = i;
        if (l < n && arr[l] < arr[smallest]) smallest = l;
        if (r < n && arr[r] < arr[smallest]) smallest = r;
        if (smallest == i) return;
        int tmp = arr[i]; arr[i] = arr[smallest]; arr[smallest] = tmp;
        i = smallest;
    }
}`,
    whyOn: "왜 O(n)인가? 깊이 h의 노드는 최대 h번 siftDown, 그런 노드의 개수는 약 n/2^(h+1)개. 총 비용 = Σ h × (n / 2^(h+1)) — 등비×선형 급수가 수렴해 O(n).",
  },
  heapSortImpl: {
    title: "Heap Sort 구현 — In-place, O(n log n) 보장",
    intro: "1) 배열을 Max-Heap으로 빌드 (O(n)). 2) 루트(최댓값)를 마지막과 swap, 힙 크기 줄이고 siftDown 반복 (n × O(log n)).",
    code: `public static void heapSort(int[] arr) {
    int n = arr.length;

    // 1) Max-Heap 빌드 — O(n)
    for (int i = n / 2 - 1; i >= 0; i--) {
        siftDownMax(arr, i, n);
    }

    // 2) 루트와 마지막 swap → 힙 크기 1 줄임 → siftDown 반복
    for (int end = n - 1; end > 0; end--) {
        int tmp = arr[0]; arr[0] = arr[end]; arr[end] = tmp;
        siftDownMax(arr, 0, end);   // 'end'가 새 힙 크기
    }
}

// Max-Heap용 siftDown — 부등호 반대
private static void siftDownMax(int[] arr, int i, int n) {
    while (true) {
        int l = 2 * i + 1, r = 2 * i + 2, largest = i;
        if (l < n && arr[l] > arr[largest]) largest = l;
        if (r < n && arr[r] > arr[largest]) largest = r;
        if (largest == i) return;
        int tmp = arr[i]; arr[i] = arr[largest]; arr[largest] = tmp;
        i = largest;
    }
}`,
    note: "Max-Heap을 쓰는 이유: 매번 루트(최댓값)를 뒤쪽으로 보내면 자연스럽게 오름차순 정렬. 추가 공간 없음 (In-place). 안정 정렬 아님 (멀리 떨어진 원소 swap).",
  },
  topKImpl: {
    title: "Top-K 문제 — Min-Heap 크기 K 유지",
    intro: "n개 중 가장 큰 K개를 찾는 문제. 전체 정렬은 O(n log n)이지만, Min-Heap 크기 K만 유지하면 O(n log k) — K가 작을 때 훨씬 빠름.",
    code: `import java.util.PriorityQueue;

public static int[] topK(int[] arr, int k) {
    // Java 기본 PriorityQueue는 Min-Heap
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();

    for (int x : arr) {
        if (minHeap.size() < k) {
            minHeap.offer(x);
        } else if (x > minHeap.peek()) {
            // 힙의 최솟값보다 크면 교체
            minHeap.poll();
            minHeap.offer(x);
        }
    }
    // 힙에 남은 K개가 답
    int[] result = new int[k];
    for (int i = 0; i < k; i++) result[i] = minHeap.poll();
    return result;
}`,
    insight: "왜 Min-Heap인가? 가장 큰 K개를 추적하려면 '지금까지의 K개 중 가장 작은 것'을 빨리 알아야 함. 그게 Min-Heap의 루트. 새 원소가 그보다 크면 자리 바꿈.",
  },
  pqImpl: {
    title: "Java PriorityQueue — 실전에서는 직접 구현 X",
    intro: "교육용으로는 직접 짜보지만, 실무에선 표준 라이브러리 사용. Java의 PriorityQueue는 Min-Heap 기반.",
    code: `import java.util.PriorityQueue;
import java.util.Comparator;

// 기본: Min-Heap
PriorityQueue<Integer> minPQ = new PriorityQueue<>();
minPQ.offer(5);    // O(log n) 삽입
minPQ.offer(1);
minPQ.offer(3);
minPQ.peek();      // 1 (최솟값)
minPQ.poll();      // 1 반환 & 제거

// Max-Heap: Comparator 역순
PriorityQueue<Integer> maxPQ = new PriorityQueue<>(Comparator.reverseOrder());

// 객체 정렬: 우선순위 기준 지정
PriorityQueue<Task> taskQueue = new PriorityQueue<>(
    Comparator.comparingInt(t -> t.priority)
);

// Dijkstra에서 자주 쓰는 패턴: (거리, 노드) 쌍을 거리로 정렬
PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
pq.offer(new int[]{0, src});`,
    note: "내부적으로 배열 기반 binary heap. add/offer = O(log n), poll = O(log n), peek = O(1). 단, contains/remove(Object)는 O(n) — 임의 원소 찾으려면 linear scan.",
  },
  summary: {
    title: "핵심 개념 정리",
    items: [
      { label: "힙 속성", text: "Max: 부모 ≥ 자식. Min: 부모 ≤ 자식. 형제 간엔 순서 없음 — 루트만 보장." },
      { label: "배열 표현", text: "완전 이진 트리이므로 배열로 저장. parent(i)=(i-1)/2, child(i)=2i+1, 2i+2." },
      { label: "Insert (sift-up)", text: "끝에 추가 후 부모와 비교하며 위로. O(log n)." },
      { label: "Extract (sift-down)", text: "루트 반환, 끝을 루트로, 자식과 비교하며 아래로. O(log n)." },
      { label: "Build-Heap", text: "n개 한꺼번에 → O(n). 핵심 트릭: 마지막 비-leaf부터 siftDown 거꾸로." },
      { label: "Heap Sort", text: "Build + n × Extract. O(n log n) 보장, O(1) 추가 공간, 불안정." },
      { label: "siftDown 주의", text: "양쪽 자식 중 더 작은(또는 큰) 쪽과 swap. 한쪽만 보면 힙 속성 깨질 수 있음." },
      { label: "우선순위 큐", text: "힙의 가장 흔한 응용. Dijkstra, A*, 작업 스케줄링. Java는 PriorityQueue 클래스." },
      { label: "Top-K", text: "Min-Heap 크기 K. heap[0]보다 큰 새 원소만 push & pop. O(n log k)." },
      { label: "Java 팁", text: "Max-Heap은 Comparator.reverseOrder(). 객체는 Comparator.comparing... 으로 우선순위 키 지정." },
    ],
  },
};

const EN = {
  breadcrumb: {
    home: "cs-canvas",
    parent: "data-structures",
    current: "heaps",
  },
  hero: {
    title: "Heaps",
    desc: "A complete binary tree where you can always pull the max (or min) in O(1).\nThe standard implementation of priority queues — Dijkstra, scheduling, top-K problems.",
    tags: ["Min-Heap", "Max-Heap", "Heapify", "Priority queue", "Heap Sort"],
  },
  sections: [
    {
      number: "01",
      title: "Heap Property & Complete Tree Shape",
      desc: "Max-Heap: every parent ≥ children. Min-Heap: every parent ≤ children. Siblings are not ordered — only the root is guaranteed to be max/min. The tree is complete, so it fits in an array.",
    },
    {
      number: "02",
      title: "Array Representation — No Pointers",
      desc: "Index i: parent = (i-1)/2, left child = 2i+1, right child = 2i+2. Because the tree is complete, the array has no gaps.",
    },
    {
      number: "03",
      title: "Insert — sift-up",
      desc: "1) Append to the end of the array. 2) Compare with parent; swap if heap property breaks (sift-up). 3) Repeat until root or property holds. O(log n).",
    },
    {
      number: "04",
      title: "Extract-Max (Pop) — sift-down",
      desc: "1) Save the root. 2) Move the last array element to the root. 3) Swap with the larger child (sift-down). 4) Repeat until heap property holds. O(log n).",
    },
    {
      number: "05",
      title: "Heapify — O(n) build",
      desc: "Building a heap from n elements. Inserting one by one is O(n log n). Sifting down from the last non-leaf is O(n) — deeper nodes are fewer.",
    },
    {
      number: "06",
      title: "Uses — Priority Queue, Heap Sort, Top-K",
      desc: "Standard PQ implementation. Heap Sort: build max-heap, swap root with last, shrink heap, repeat. O(n log n) + O(1). Top-K: keep only K in a min-heap → O(n log k).",
    },
  ],
  arrayRep: {
    title: "Min-Heap Array Representation",
    tree: `        1
       / \\
      3   5
     / \\ / \\
    4  8 6  9`,
    array: "[1, 3, 5, 4, 8, 6, 9]",
    indices: [
      "i=0: 1 (root)",
      "i=1: 3, parent=(1-1)/2=0 ✓",
      "i=2: 5, parent=(2-1)/2=0 ✓",
      "i=3: 4, parent=(3-1)/2=1 ✓",
      "i=4: 8, parent=(4-1)/2=1 ✓",
      "i=5: 6, parent=(5-1)/2=2 ✓",
      "i=6: 9, parent=(6-1)/2=2 ✓",
    ],
  },
  insert: {
    title: "Insert(2) — into Min-Heap",
    steps: [
      { state: "[1, 3, 5, 4, 8, 6, 9]", action: "append 2 at end" },
      { state: "[1, 3, 5, 4, 8, 6, 9, 2]", action: "2(i=7) vs parent 4(i=3): 2 < 4 → swap" },
      { state: "[1, 3, 5, 2, 8, 6, 9, 4]", action: "2(i=3) vs parent 3(i=1): 2 < 3 → swap" },
      { state: "[1, 2, 5, 3, 8, 6, 9, 4]", action: "2(i=1) vs parent 1(i=0): 2 > 1 → stop" },
    ],
  },
  extract: {
    title: "Extract-Min — pop root from Min-Heap",
    steps: [
      { state: "[1, 3, 5, 4, 8, 6, 9]", action: "save root 1, move last 9 to root" },
      { state: "[9, 3, 5, 4, 8, 6]", action: "9 vs min(3,5) = 3 → swap" },
      { state: "[3, 9, 5, 4, 8, 6]", action: "9(i=1) vs min(4,8) = 4 → swap" },
      { state: "[3, 4, 5, 9, 8, 6]", action: "9(i=3) is leaf → stop. return 1" },
    ],
  },
  complexity: {
    title: "Complexity",
    headers: ["Operation", "Complexity", "Note"],
    rows: [
      ["Find-Min/Max (Peek)", "O(1)", "Root as-is"],
      ["Insert", "O(log n)", "Sift-up"],
      ["Extract-Min/Max", "O(log n)", "Sift-down"],
      ["Decrease-Key", "O(log n)", "Sift-up from index"],
      ["Build-Heap", "O(n)", "Heapify algorithm"],
      ["Heap Sort", "O(n log n)", "Build + n × Extract"],
    ],
  },
  usage: {
    title: "Common Heap Uses",
    items: [
      { name: "Priority Queue", desc: "OS scheduling, event simulation. Push and Pop both O(log n)." },
      { name: "Dijkstra Shortest Path", desc: "Pop the cheapest unfinished node. Requires a Min-Heap." },
      { name: "Heap Sort", desc: "Build Max-Heap → swap root with last → shrink, repeat. O(n log n) + O(1) space." },
      { name: "Top-K Problems", desc: "Push only if greater than heap min. Min-Heap of size K → O(n log k)." },
      { name: "Streaming Median", desc: "Max-Heap (lower half) + Min-Heap (upper half) maintain median in O(log n) per insert." },
      { name: "Merge K Sorted Lists", desc: "Push the head of each list into a Min-Heap; pop and push the next from that list. O(N log k)." },
    ],
  },
  vsBST: {
    title: "Heap vs BST",
    headers: ["", "Binary Heap", "Binary Search Tree"],
    rows: [
      ["Ordering", "Only root is max/min", "Fully sorted (in-order)"],
      ["Find-Min/Max", "O(1)", "O(log n)"],
      ["Search (arbitrary key)", "O(n)", "O(log n)"],
      ["Memory", "Array, no pointers", "Nodes + pointers"],
      ["When to use", "Need only priority", "Need range/order queries"],
    ],
  },
  heapImpl: {
    title: "Min-Heap Full Implementation — Java",
    intro: "Use an ArrayList as backing store; compute parent/children with index math. siftUp and siftDown are the core building blocks.",
    code: `import java.util.ArrayList;
import java.util.List;

class MinHeap {
    private final List<Integer> data = new ArrayList<>();

    // Index arithmetic — the core formulas
    private int parent(int i) { return (i - 1) / 2; }
    private int left(int i)   { return 2 * i + 1; }
    private int right(int i)  { return 2 * i + 2; }

    public int size()       { return data.size(); }
    public boolean isEmpty(){ return data.isEmpty(); }

    // Peek — O(1)
    public int peek() {
        if (data.isEmpty()) throw new IllegalStateException("empty heap");
        return data.get(0);
    }

    // Insert — O(log n)
    public void insert(int key) {
        data.add(key);              // 1) append to end
        siftUp(data.size() - 1);    // 2) bubble up to restore heap property
    }

    // Extract-Min — O(log n)
    public int extractMin() {
        if (data.isEmpty()) throw new IllegalStateException("empty heap");
        int min = data.get(0);
        int last = data.remove(data.size() - 1);
        if (!data.isEmpty()) {
            data.set(0, last);      // move last to root
            siftDown(0);            // restore by going down
        }
        return min;
    }

    // siftUp: swap with parent while smaller than it
    private void siftUp(int i) {
        while (i > 0) {
            int p = parent(i);
            if (data.get(i) >= data.get(p)) break;   // heap property OK
            swap(i, p);
            i = p;
        }
    }

    // siftDown: swap with the smaller child while bigger than it
    private void siftDown(int i) {
        int n = data.size();
        while (true) {
            int l = left(i), r = right(i), smallest = i;
            if (l < n && data.get(l) < data.get(smallest)) smallest = l;
            if (r < n && data.get(r) < data.get(smallest)) smallest = r;
            if (smallest == i) break;                 // can't go further
            swap(i, smallest);
            i = smallest;
        }
    }

    private void swap(int i, int j) {
        int tmp = data.get(i);
        data.set(i, data.get(j));
        data.set(j, tmp);
    }
}`,
    keypoints: [
      "siftUp = while (smaller than parent) swap up. siftDown = while (bigger than smaller child) swap down.",
      "siftDown must compare with the smaller (or larger) of the two children — looking at only one can break the heap property.",
      "Insert: push to end → siftUp. Extract: save root → move last to root → siftDown.",
      "For a Max-Heap, flip the comparison (`>` ↔ `<`). Or negate values and use Min-Heap as-is.",
    ],
  },
  buildHeapImpl: {
    title: "Build-Heap — Bulk Construction in O(n)",
    intro: "Inserting n elements one by one is O(n log n). But if you take the array as-is and siftDown from the last non-leaf backward, you get O(n).",
    code: `// Build a heap from an existing array — O(n)
public static void buildHeap(int[] arr) {
    int n = arr.length;
    // Last parent index = n/2 - 1
    // Walk backward and siftDown each
    for (int i = n / 2 - 1; i >= 0; i--) {
        siftDownArr(arr, i, n);
    }
}

private static void siftDownArr(int[] arr, int i, int n) {
    while (true) {
        int l = 2 * i + 1, r = 2 * i + 2, smallest = i;
        if (l < n && arr[l] < arr[smallest]) smallest = l;
        if (r < n && arr[r] < arr[smallest]) smallest = r;
        if (smallest == i) return;
        int tmp = arr[i]; arr[i] = arr[smallest]; arr[smallest] = tmp;
        i = smallest;
    }
}`,
    whyOn: "Why O(n)? A node at depth h does at most h siftDown steps, and there are about n/2^(h+1) such nodes. Total = Σ h × (n / 2^(h+1)) — a converging series → O(n).",
  },
  heapSortImpl: {
    title: "Heap Sort — In-place, Guaranteed O(n log n)",
    intro: "1) Build a Max-Heap (O(n)). 2) Swap root (max) with the last, shrink heap, siftDown — repeat (n × O(log n)).",
    code: `public static void heapSort(int[] arr) {
    int n = arr.length;

    // 1) Build Max-Heap — O(n)
    for (int i = n / 2 - 1; i >= 0; i--) {
        siftDownMax(arr, i, n);
    }

    // 2) Swap root with last → shrink heap → siftDown, repeat
    for (int end = n - 1; end > 0; end--) {
        int tmp = arr[0]; arr[0] = arr[end]; arr[end] = tmp;
        siftDownMax(arr, 0, end);   // 'end' is the new heap size
    }
}

// Max-Heap siftDown — flipped comparisons
private static void siftDownMax(int[] arr, int i, int n) {
    while (true) {
        int l = 2 * i + 1, r = 2 * i + 2, largest = i;
        if (l < n && arr[l] > arr[largest]) largest = l;
        if (r < n && arr[r] > arr[largest]) largest = r;
        if (largest == i) return;
        int tmp = arr[i]; arr[i] = arr[largest]; arr[largest] = tmp;
        i = largest;
    }
}`,
    note: "Why Max-Heap? Pushing the max to the back each iteration produces ascending order naturally. No extra space (in-place). Not stable (swaps reach far).",
  },
  topKImpl: {
    title: "Top-K Problem — Maintain a Min-Heap of size K",
    intro: "Find the K largest of n values. Full sort is O(n log n); keeping a Min-Heap of size K gives O(n log k) — much faster when K is small.",
    code: `import java.util.PriorityQueue;

public static int[] topK(int[] arr, int k) {
    // Java's default PriorityQueue is a Min-Heap
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();

    for (int x : arr) {
        if (minHeap.size() < k) {
            minHeap.offer(x);
        } else if (x > minHeap.peek()) {
            // bigger than the heap min → replace
            minHeap.poll();
            minHeap.offer(x);
        }
    }
    // The remaining K elements are the answer
    int[] result = new int[k];
    for (int i = 0; i < k; i++) result[i] = minHeap.poll();
    return result;
}`,
    insight: "Why Min-Heap? To track the K largest you need fast access to 'the smallest of the current K'. That's a Min-Heap's root. New element bigger than that → swap in.",
  },
  pqImpl: {
    title: "Java PriorityQueue — In Practice, Use the Library",
    intro: "Roll your own for learning, use the stdlib in production. Java's PriorityQueue is a Min-Heap.",
    code: `import java.util.PriorityQueue;
import java.util.Comparator;

// Default: Min-Heap
PriorityQueue<Integer> minPQ = new PriorityQueue<>();
minPQ.offer(5);    // O(log n) insertion
minPQ.offer(1);
minPQ.offer(3);
minPQ.peek();      // 1 (min)
minPQ.poll();      // returns 1 and removes

// Max-Heap: reverse comparator
PriorityQueue<Integer> maxPQ = new PriorityQueue<>(Comparator.reverseOrder());

// Object sorting: specify the priority key
PriorityQueue<Task> taskQueue = new PriorityQueue<>(
    Comparator.comparingInt(t -> t.priority)
);

// Dijkstra-style: (distance, node) pairs ordered by distance
PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
pq.offer(new int[]{0, src});`,
    note: "Internally an array-backed binary heap. add/offer/poll are O(log n); peek is O(1). But contains/remove(Object) is O(n) — no efficient arbitrary lookup.",
  },
  summary: {
    title: "Key Concepts",
    items: [
      { label: "Heap property", text: "Max: parent ≥ children. Min: parent ≤ children. No sibling ordering — only the root is guaranteed." },
      { label: "Array form", text: "Complete tree → packed array. parent(i)=(i-1)/2, child(i)=2i+1, 2i+2." },
      { label: "Insert (sift-up)", text: "Append, then bubble up by comparing to parent. O(log n)." },
      { label: "Extract (sift-down)", text: "Save root, move last to root, swap with larger/smaller child. O(log n)." },
      { label: "Build-Heap", text: "Bulk build is O(n). Trick: sift-down starting from the last non-leaf backward." },
      { label: "Heap Sort", text: "Build + n × Extract. Guaranteed O(n log n), O(1) extra space, unstable." },
      { label: "siftDown gotcha", text: "Compare with the smaller (or larger) of the two children — looking at only one can break the property." },
      { label: "Priority Queue", text: "Heap's most common use. Dijkstra, A*, scheduling. Java has PriorityQueue." },
      { label: "Top-K", text: "Min-Heap of size K. Push only when bigger than heap[0]. O(n log k)." },
      { label: "Java tips", text: "Max-Heap via Comparator.reverseOrder(). Objects via Comparator.comparing... to specify the priority key." },
    ],
  },
};

interface SectionProps {
  number: string;
  title: string;
  description: string;
  children: ReactNode;
}

function Section({ number, title, description, children }: SectionProps) {
  return (
    <section className="mb-16">
      <div className="mb-6">
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-xs font-mono text-emerald-500/60">{number}</span>
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function HeapsPage() {
  const { lang } = useLanguage();
  const t = lang === "ko" ? KO : EN;

  return (
    <div className="relative min-h-screen bg-grid-pattern">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(52,211,153,0.05),transparent)]" />

      <div className="relative mx-auto max-w-4xl px-6 py-16">
        {/* breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-600 mb-10">
          <Link href="/" className="hover:text-zinc-400 transition-colors">{t.breadcrumb.home}</Link>
          <span>/</span>
          <Link href="/data-structures" className="hover:text-zinc-400 transition-colors">{t.breadcrumb.parent}</Link>
          <span>/</span>
          <span className="text-zinc-400">{t.breadcrumb.current}</span>
        </div>

        {/* hero */}
        <div className="mb-16">
          <h1 className="text-3xl font-bold text-white font-mono mb-4">{t.hero.title}</h1>
          <p className="text-zinc-400 text-base leading-relaxed max-w-2xl mb-6 whitespace-pre-line">{t.hero.desc}</p>
          <div className="flex items-center gap-0 text-xs font-mono flex-wrap">
            {t.hero.tags.map((label, i, arr) => (
              <span key={label} className="flex items-center">
                <span className="text-zinc-500 px-2 py-1 rounded border border-white/[0.06] bg-white/[0.02]">{label}</span>
                {i < arr.length - 1 && <span className="text-zinc-700 mx-1.5">→</span>}
              </span>
            ))}
          </div>
        </div>

        {/* 01 + 02 - property + array */}
        <Section
          number={t.sections[0].number}
          title={t.sections[0].title}
          description={t.sections[0].desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.arrayRep.title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <pre className="text-[11px] font-mono text-emerald-300 mb-3">{t.arrayRep.tree}</pre>
                <div className="text-[11px] font-mono text-zinc-400">
                  <span className="text-zinc-500">array: </span>
                  <span className="text-emerald-300/80">{t.arrayRep.array}</span>
                </div>
              </div>
              <div className="space-y-1">
                {t.arrayRep.indices.map((idx, i) => (
                  <div key={i} className="text-[10px] font-mono text-zinc-400">{idx}</div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* 03 - insert */}
        <Section
          number={t.sections[2].number}
          title={t.sections[2].title}
          description={t.sections[2].desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.insert.title}</h3>
            <div className="space-y-2">
              {t.insert.steps.map((s, i) => (
                <div key={i} className="grid grid-cols-[1fr_1.2fr] gap-3 text-[11px] font-mono">
                  <code className="text-emerald-300/80">{s.state}</code>
                  <span className="text-zinc-500">{s.action}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* 04 - extract */}
        <Section
          number={t.sections[3].number}
          title={t.sections[3].title}
          description={t.sections[3].desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.extract.title}</h3>
            <div className="space-y-2">
              {t.extract.steps.map((s, i) => (
                <div key={i} className="grid grid-cols-[1fr_1.2fr] gap-3 text-[11px] font-mono">
                  <code className="text-emerald-300/80">{s.state}</code>
                  <span className="text-zinc-500">{s.action}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* 05 - heapify (complexity table) */}
        <Section
          number={t.sections[4].number}
          title={t.sections[4].title}
          description={t.sections[4].desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.complexity.title}</h3>
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  {t.complexity.headers.map((h, i) => (
                    <th key={i} className={`text-left py-2 ${i === 0 ? "text-emerald-400 w-44" : i === 1 ? "text-zinc-400 w-32" : "text-zinc-500"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.complexity.rows.map((row, i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    {row.map((cell, j) => (
                      <td key={j} className={`py-2 ${j === 0 ? "text-emerald-300/80" : j === 1 ? "text-zinc-300" : "text-zinc-500"}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
              <pre className="text-[10px] font-mono text-zinc-400 leading-relaxed">{`void buildHeap(int[] arr) {
    int n = arr.length;
    for (int i = n / 2 - 1; i >= 0; i--) {
        siftDown(arr, i, n);
    }
}
// total work bounded by Σ h × (n / 2^(h+1)) = O(n)`}</pre>
            </div>
          </div>
        </Section>

        {/* 06 - usage */}
        <Section
          number={t.sections[5].number}
          title={t.sections[5].title}
          description={t.sections[5].desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-4">{t.usage.title}</h3>
            <div className="space-y-2">
              {t.usage.items.map((u) => (
                <div key={u.name} className="rounded-lg border border-zinc-700/40 bg-zinc-900/30 p-3">
                  <div className="text-xs font-mono text-emerald-300 font-semibold mb-1">{u.name}</div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{u.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Heap vs BST */}
        <Section number="07" title={t.vsBST.title} description="">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  {t.vsBST.headers.map((h, i) => (
                    <th key={i} className={`text-left py-2 ${i === 0 ? "text-zinc-600 w-32" : i === 1 ? "text-emerald-400" : "text-cyan-400"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.vsBST.rows.map((row, i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    <td className="py-2 text-zinc-500">{row[0]}</td>
                    <td className="py-2 text-emerald-300/80">{row[1]}</td>
                    <td className="py-2 text-cyan-300/80">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* 08 - Min-Heap Java implementation */}
        <Section number="08" title={t.heapImpl.title} description={t.heapImpl.intro}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <pre className="text-[11px] font-mono text-zinc-300 leading-relaxed bg-zinc-900/30 p-4 rounded overflow-x-auto">{t.heapImpl.code}</pre>
            <div className="mt-4 space-y-2">
              {t.heapImpl.keypoints.map((kp, i) => (
                <div key={i} className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                  <p className="text-[11px] text-zinc-400 leading-relaxed">💡 {kp}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* 09 - Build-Heap */}
        <Section number="09" title={t.buildHeapImpl.title} description={t.buildHeapImpl.intro}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <pre className="text-[11px] font-mono text-zinc-300 leading-relaxed bg-zinc-900/30 p-4 rounded overflow-x-auto">{t.buildHeapImpl.code}</pre>
            <div className="mt-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3">
              <p className="text-[11px] text-cyan-300/80 leading-relaxed">🔍 {t.buildHeapImpl.whyOn}</p>
            </div>
          </div>
        </Section>

        {/* 10 - Heap Sort */}
        <Section number="10" title={t.heapSortImpl.title} description={t.heapSortImpl.intro}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <pre className="text-[11px] font-mono text-zinc-300 leading-relaxed bg-zinc-900/30 p-4 rounded overflow-x-auto">{t.heapSortImpl.code}</pre>
            <p className="text-[10px] text-zinc-500 italic mt-3">📝 {t.heapSortImpl.note}</p>
          </div>
        </Section>

        {/* 11 - Top-K */}
        <Section number="11" title={t.topKImpl.title} description={t.topKImpl.intro}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <pre className="text-[11px] font-mono text-zinc-300 leading-relaxed bg-zinc-900/30 p-4 rounded overflow-x-auto">{t.topKImpl.code}</pre>
            <div className="mt-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
              <p className="text-[11px] text-emerald-300/80 leading-relaxed">💡 {t.topKImpl.insight}</p>
            </div>
          </div>
        </Section>

        {/* 12 - Java PriorityQueue */}
        <Section number="12" title={t.pqImpl.title} description={t.pqImpl.intro}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <pre className="text-[11px] font-mono text-zinc-300 leading-relaxed bg-zinc-900/30 p-4 rounded overflow-x-auto">{t.pqImpl.code}</pre>
            <p className="text-[10px] text-zinc-500 italic mt-3">⚠ {t.pqImpl.note}</p>
          </div>
        </Section>

        {/* summary */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h3 className="text-white font-semibold text-sm font-mono mb-5">{t.summary.title}</h3>
          <div className="space-y-3">
            {t.summary.items.map((item) => (
              <div key={item.label} className="flex gap-3 items-start">
                <span className="text-xs font-mono text-emerald-500/50 shrink-0 mt-0.5 min-w-[140px]">{item.label}</span>
                <p className="text-zinc-400 text-xs leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
