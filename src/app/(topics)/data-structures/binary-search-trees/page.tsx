"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { ReactNode } from "react";

const KO = {
  breadcrumb: {
    home: "cs-canvas",
    parent: "data-structures",
    current: "binary search trees",
  },
  hero: {
    title: "Binary Search Trees",
    desc: "정렬된 배열의 빠른 검색 + 연결 리스트의 빠른 삽입을 결합한 트리.\n균형이 잡히면 O(log n), 한쪽으로 쏠리면 O(n) — 균형이 핵심입니다.",
    tags: ["BST 속성", "삽입/삭제", "순회", "균형 트리", "AVL", "Red-Black"],
  },
  sections: [
    {
      number: "01",
      title: "BST 속성",
      desc: "각 노드 X에 대해: 왼쪽 서브트리의 모든 키 < X.key < 오른쪽 서브트리의 모든 키. 이 단순한 불변 규칙 하나로 정렬된 데이터를 logarithmic 시간에 찾을 수 있게 됩니다.",
    },
    {
      number: "02",
      title: "삽입 — 비교하며 내려가다 빈자리에",
      desc: "루트에서 시작. 키가 작으면 왼쪽, 크면 오른쪽으로 이동. NULL을 만나면 그 자리에 새 노드 부착. O(h) — 균형 트리면 O(log n).",
    },
    {
      number: "03",
      title: "삭제 — 3가지 경우",
      desc: "자식 0개: 그냥 제거. 자식 1개: 자식으로 대체. 자식 2개: 오른쪽 서브트리의 최솟값(in-order successor)으로 대체 후 그것을 삭제.",
    },
    {
      number: "04",
      title: "순회 — In/Pre/Post/Level Order",
      desc: "In-order(왼-루-오): 정렬된 순서로 출력. Pre-order(루-왼-오): 트리 복제. Post-order(왼-오-루): 트리 삭제, 후위 계산. Level-order(BFS): 레벨별.",
    },
    {
      number: "05",
      title: "균형이 깨지면 — 최악 O(n)",
      desc: "이미 정렬된 데이터를 순서대로 삽입하면 트리가 연결 리스트로 변형. 검색/삽입/삭제 모두 O(n). 해결: 자동 균형 트리 (AVL, Red-Black, B-Tree).",
    },
    {
      number: "06",
      title: "자가 균형 트리 — AVL vs Red-Black",
      desc: "AVL: 엄격한 균형 (좌우 높이 차 ≤ 1), 검색 빠름, 회전 잦음. Red-Black: 느슨한 균형 (검은 노드 높이만 같음), 삽입/삭제 빠름. 대부분의 표준 라이브러리는 Red-Black.",
    },
  ],
  property: {
    title: "BST 구조 예시",
    diagram: `         8
        / \\
       3   10
      / \\    \\
     1   6    14
        / \\   /
       4   7 13`,
    invariant: "모든 노드 X에 대해: left 서브트리 < X < right 서브트리",
    inOrder: "In-order 순회: 1, 3, 4, 6, 7, 8, 10, 13, 14 (정렬됨)",
  },
  insertExample: {
    title: "삽입 — 5를 위 트리에 삽입",
    steps: [
      "1. 루트 8과 비교: 5 < 8 → 왼쪽",
      "2. 노드 3과 비교: 5 > 3 → 오른쪽",
      "3. 노드 6과 비교: 5 < 6 → 왼쪽",
      "4. 노드 4와 비교: 5 > 4 → 오른쪽",
      "5. NULL → 5를 4의 오른쪽 자식으로 부착",
    ],
  },
  deleteCase: {
    title: "삭제의 3가지 경우",
    cases: [
      {
        name: "Case 1: leaf",
        desc: "자식 없음",
        example: "삭제(13): 그냥 부모(14)의 자식 포인터를 NULL로",
      },
      {
        name: "Case 2: 자식 1개",
        desc: "자식 하나만 있음",
        example: "삭제(10): 자식(14)을 10의 자리로 끌어올림",
      },
      {
        name: "Case 3: 자식 2개",
        desc: "후속자 사용",
        example: "삭제(3): 오른쪽 서브트리 최솟값(4)을 3의 자리에 복사, 원래 4 제거",
      },
    ],
  },
  traversal: {
    title: "트리 순회 비교",
    headers: ["순회", "순서", "결과 (위 트리)"],
    rows: [
      ["In-order", "왼 → 루트 → 오", "1, 3, 4, 6, 7, 8, 10, 13, 14"],
      ["Pre-order", "루트 → 왼 → 오", "8, 3, 1, 6, 4, 7, 10, 14, 13"],
      ["Post-order", "왼 → 오 → 루트", "1, 4, 7, 6, 3, 13, 14, 10, 8"],
      ["Level-order", "BFS (큐 사용)", "8, 3, 10, 1, 6, 14, 4, 7, 13"],
    ],
  },
  unbalanced: {
    title: "불균형 BST — 정렬된 입력 [1,2,3,4,5] 삽입",
    diagram: `1
 \\
  2
   \\
    3
     \\
      4
       \\
        5`,
    note: "연결 리스트와 동일 — 검색/삽입/삭제 모두 O(n)",
  },
  complexity: {
    title: "복잡도 비교",
    headers: ["연산", "평균 (균형)", "최악 (편향)", "AVL/RB"],
    rows: [
      ["Search", "O(log n)", "O(n)", "O(log n) 보장"],
      ["Insert", "O(log n)", "O(n)", "O(log n) 보장"],
      ["Delete", "O(log n)", "O(n)", "O(log n) 보장"],
      ["Min/Max", "O(log n)", "O(n)", "O(log n) 보장"],
      ["In-order traversal", "O(n)", "O(n)", "O(n)"],
    ],
  },
  balancedCompare: {
    title: "AVL vs Red-Black",
    headers: ["", "AVL", "Red-Black"],
    rows: [
      ["균형 기준", "좌우 높이 차 ≤ 1", "검은 노드 높이만 동일"],
      ["트리 높이", "더 낮음 (≤ 1.44 log n)", "더 높음 (≤ 2 log n)"],
      ["검색 속도", "더 빠름", "약간 느림"],
      ["삽입/삭제", "회전 많음 → 느림", "회전 적음 → 빠름"],
      ["사용처", "검색 위주 (DB 인덱스)", "범용 (C++ map, Java TreeMap)"],
    ],
  },
  bstImpl: {
    title: "BST 전체 구현 — Java",
    intro: "재귀로 구현하면 깔끔. 각 메서드가 'subtree의 root를 받아서 변경된 subtree의 root를 반환'하는 패턴.",
    code: `class Node {
    int key;
    Node left, right;
    Node(int key) { this.key = key; }
}

class BST {
    Node root;

    // 검색 — O(h)
    public boolean search(int key) {
        return searchRec(root, key);
    }
    private boolean searchRec(Node node, int key) {
        if (node == null) return false;
        if (key == node.key) return true;
        return key < node.key
            ? searchRec(node.left, key)
            : searchRec(node.right, key);
    }

    // 삽입 — O(h)
    public void insert(int key) {
        root = insertRec(root, key);
    }
    private Node insertRec(Node node, int key) {
        if (node == null) return new Node(key);
        if (key < node.key)      node.left  = insertRec(node.left, key);
        else if (key > node.key) node.right = insertRec(node.right, key);
        // 같은 키는 무시 (또는 중복 허용 정책에 따라 처리)
        return node;
    }

    // 삭제 — O(h), 3가지 케이스
    public void delete(int key) {
        root = deleteRec(root, key);
    }
    private Node deleteRec(Node node, int key) {
        if (node == null) return null;
        if (key < node.key)      node.left  = deleteRec(node.left, key);
        else if (key > node.key) node.right = deleteRec(node.right, key);
        else {
            // 찾았다 — 3가지 케이스
            if (node.left == null)  return node.right;  // case 1, 2
            if (node.right == null) return node.left;
            // case 3: 자식 둘 — in-order successor로 대체
            Node successor = minNode(node.right);
            node.key = successor.key;
            node.right = deleteRec(node.right, successor.key);
        }
        return node;
    }
    private Node minNode(Node node) {
        while (node.left != null) node = node.left;
        return node;
    }

    // In-order 순회 — 정렬된 출력
    public void inorder() {
        inorderRec(root);
    }
    private void inorderRec(Node node) {
        if (node == null) return;
        inorderRec(node.left);
        System.out.print(node.key + " ");
        inorderRec(node.right);
    }
}`,
    keypoints: [
      "재귀 함수가 항상 노드를 반환 → 호출자는 그 결과를 자기 left/right에 다시 할당. 부모-자식 포인터 갱신을 한 줄로 처리.",
      "삭제의 자식 2개 케이스가 핵심. successor의 key만 복사하고, 그 successor를 다시 삭제 (이번엔 자식 1개 이하 케이스가 됨).",
      "균형 트리가 아니므로 최악 O(n). 정렬된 입력 [1,2,3,...] 넣으면 연결 리스트가 됨 → AVL/RB가 필요한 이유.",
    ],
  },
  avl: {
    title: "AVL Tree — 엄격한 균형 트리",
    intro: "1962년 Adelson-Velsky & Landis가 발명. 최초의 자가 균형 BST.\n핵심 규칙: 모든 노드의 좌우 서브트리 높이 차이 ≤ 1.",
    balanceFactor: {
      title: "Balance Factor (BF)",
      desc: "BF(node) = height(node.left) − height(node.right). -1, 0, 1만 허용. 절댓값이 2 이상이면 불균형 → 회전 필요.",
      example: `        10 (BF=0)
       /  \\
      5    15 (BF=-1)
     /       \\
    3         20

각 노드의 BF가 |BF| ≤ 1 이면 AVL 만족.`,
    },
    rotations: {
      title: "4가지 회전 케이스",
      desc: "삽입/삭제 후 불균형(|BF|>1) 발생 시, 어떤 방향으로 무거워졌느냐에 따라 4가지 케이스. 각각 정해진 회전으로 균형 복원.",
      cases: [
        {
          name: "LL Case — 오른쪽 회전 (Right Rotation)",
          when: "z.left.left 쪽이 무거움 (왼쪽-왼쪽으로 추가).",
          before: `      z (BF=2)
     /
    y (BF=1)
   /
  x   ← 새로 추가됨`,
          after: `    y
   / \\
  x   z`,
          rotation: "z를 중심으로 오른쪽 회전: y가 새 루트, z는 y의 오른쪽 자식.",
        },
        {
          name: "RR Case — 왼쪽 회전 (Left Rotation)",
          when: "z.right.right 쪽이 무거움. LL의 대칭.",
          before: `  z (BF=-2)
   \\
    y (BF=-1)
     \\
      x   ← 새로 추가됨`,
          after: `    y
   / \\
  z   x`,
          rotation: "z를 중심으로 왼쪽 회전: y가 새 루트, z는 y의 왼쪽 자식.",
        },
        {
          name: "LR Case — 좌회전 후 우회전",
          when: "z.left.right 쪽이 무거움. 한 번의 회전으론 해결 안 됨.",
          before: `    z (BF=2)
   /
  y (BF=-1)
   \\
    x   ← 새로 추가됨`,
          intermediate: `    z
   /
  x       ← y에 좌회전 후
 /
y`,
          after: `    x
   / \\
  y   z`,
          rotation: "1) y를 중심으로 왼쪽 회전 → LL 형태로 변형. 2) z를 중심으로 오른쪽 회전.",
        },
        {
          name: "RL Case — 우회전 후 좌회전",
          when: "z.right.left 쪽이 무거움. LR의 대칭.",
          before: `  z (BF=-2)
   \\
    y (BF=1)
   /
  x   ← 새로 추가됨`,
          intermediate: `  z
   \\
    x       ← y에 우회전 후
     \\
      y`,
          after: `    x
   / \\
  z   y`,
          rotation: "1) y를 중심으로 오른쪽 회전 → RR 형태. 2) z를 중심으로 왼쪽 회전.",
        },
      ],
    },
    rotationCode: {
      title: "회전 — Java 구현",
      code: `// 오른쪽 회전: y가 z의 왼쪽 자식, x는 y의 왼쪽 자식인 LL 케이스
//
//      z              y
//     / \\            / \\
//    y   T4  -->    x   z
//   / \\                / \\
//  x   T3             T3  T4
//
private Node rightRotate(Node z) {
    Node y = z.left;
    Node T3 = y.right;
    // 회전 수행
    y.right = z;
    z.left  = T3;
    // 높이 갱신 (z를 먼저, y를 나중에 — z가 y의 자식이 됐으므로)
    z.height = 1 + Math.max(height(z.left), height(z.right));
    y.height = 1 + Math.max(height(y.left), height(y.right));
    return y;  // 새 루트
}

// 왼쪽 회전: 대칭
private Node leftRotate(Node z) {
    Node y = z.right;
    Node T2 = y.left;
    y.left  = z;
    z.right = T2;
    z.height = 1 + Math.max(height(z.left), height(z.right));
    y.height = 1 + Math.max(height(y.left), height(y.right));
    return y;
}`,
    },
    insertCode: {
      title: "삽입 — Java 구현 (균형 복원 포함)",
      code: `class AVLNode {
    int key, height;
    AVLNode left, right;
    AVLNode(int key) { this.key = key; this.height = 1; }
}

class AVLTree {
    AVLNode root;

    private int height(AVLNode n) { return n == null ? 0 : n.height; }
    private int bf(AVLNode n) {
        return n == null ? 0 : height(n.left) - height(n.right);
    }

    public void insert(int key) { root = insertRec(root, key); }

    private AVLNode insertRec(AVLNode node, int key) {
        // 1. 일반 BST 삽입
        if (node == null) return new AVLNode(key);
        if (key < node.key)      node.left  = insertRec(node.left, key);
        else if (key > node.key) node.right = insertRec(node.right, key);
        else return node;  // 중복 무시

        // 2. 높이 갱신
        node.height = 1 + Math.max(height(node.left), height(node.right));

        // 3. Balance Factor 확인 + 4가지 케이스 분기
        int balance = bf(node);

        // LL — 왼쪽이 무겁고, 새 키가 왼쪽 자식의 왼쪽으로 감
        if (balance > 1 && key < node.left.key)
            return rightRotate(node);

        // RR — 오른쪽이 무겁고, 새 키가 오른쪽 자식의 오른쪽으로 감
        if (balance < -1 && key > node.right.key)
            return leftRotate(node);

        // LR — 왼쪽이 무겁고, 새 키가 왼쪽 자식의 오른쪽으로 감
        if (balance > 1 && key > node.left.key) {
            node.left = leftRotate(node.left);
            return rightRotate(node);
        }

        // RL — 오른쪽이 무겁고, 새 키가 오른쪽 자식의 왼쪽으로 감
        if (balance < -1 && key < node.right.key) {
            node.right = rightRotate(node.right);
            return leftRotate(node);
        }

        return node;  // 균형 OK
    }
}`,
      note: "삽입 후 재귀가 부모로 되돌아갈 때마다 균형 검사. 한 번의 삽입은 최대 1번의 회전 (또는 2-step 회전)으로 균형 복원 → O(log n).",
    },
    summary: [
      "Balance Factor: BF = height(left) − height(right). |BF| ≤ 1 유지.",
      "삽입/삭제 후 재귀 stack 거슬러 올라가며 매 노드의 BF 검사.",
      "4가지 케이스 (LL/RR/LR/RL)에 따라 1번 또는 2번 회전.",
      "회전은 모두 O(1). 트리 높이 ≤ 1.44 log n으로 엄격하게 유지.",
      "검색 빠르지만 삽입/삭제 시 회전 자주 일어남 → Red-Black보다 쓰기 비쌈.",
    ],
  },
  rb: {
    title: "Red-Black Tree — 느슨한 균형 트리",
    intro: "1972년 Bayer가 제안 (당시 'symmetric binary B-tree'), 1978년 Guibas & Sedgewick이 현재 명칭으로 정리.\n핵심 규칙: 각 노드에 RED/BLACK 색을 부여하고, 색깔로 균형을 간접 유지.",
    properties: {
      title: "Red-Black의 5가지 속성 — 외워야 함",
      list: [
        { n: "1", rule: "모든 노드는 RED 또는 BLACK." },
        { n: "2", rule: "루트는 항상 BLACK." },
        { n: "3", rule: "모든 NIL leaf(null 자식)는 BLACK으로 간주." },
        { n: "4", rule: "RED 노드의 자식은 반드시 BLACK (연속 RED 금지)." },
        { n: "5", rule: "임의 노드에서 그 자손 NIL까지의 모든 경로는 같은 수의 BLACK 노드를 가진다 (이 수를 black-height라고 부름)." },
      ],
      why: "왜 이런 속성이 균형을 보장하나? 속성 4 (RED-RED 금지) + 속성 5 (BLACK 수 동일)로 인해 가장 긴 경로 ≤ 2 × 가장 짧은 경로. 따라서 트리 높이 ≤ 2 log(n+1).",
    },
    intuition: {
      title: "왜 이렇게 복잡한가 — 직관적 이해",
      desc: "AVL은 'BF로 균형을 정확히 측정'한다면, RB는 '색깔로 균형을 느슨하게 보장'함. 색은 회전 없이 변경 가능 → 삽입/삭제가 평균적으로 회전을 적게 함. 트리는 약간 더 높지만 (≤ 2 log n vs AVL의 1.44 log n), 쓰기 작업이 빈번한 시스템에선 이게 더 빠름.",
      simpleAnalogy: "AVL = '키 차이 1cm까지만 허용' (엄격). RB = '대충 키가 비슷하면 OK' (느슨). 검사 비용은 RB가 적지만, 결과는 둘 다 O(log n).",
    },
    insertFixup: {
      title: "삽입 후 색깔 복구 — 3가지 케이스",
      intro: "삽입한 노드는 항상 RED로 시작 (속성 5 black-height를 안 깨려고). 부모도 RED면 속성 4 위반 → 복구 필요. uncle (부모의 형제) 색에 따라 케이스가 갈림.",
      cases: [
        {
          name: "Case 1: Uncle이 RED",
          when: "부모와 uncle 둘 다 RED.",
          action: "색깔만 변경: 부모와 uncle → BLACK, grandparent → RED. 그 후 grandparent를 새로운 z로 보고 위로 올라가며 반복.",
          diagram: `   G (BLACK)              G (RED) ← 새 z
   / \\                    / \\
  P(R) U(R)    →        P(B) U(B)
  /                      /
 z(R)                   z(R)`,
          note: "회전 없이 색만 바꿈. Grandparent가 RED가 되면서 위로 전파됨.",
        },
        {
          name: "Case 2: Uncle이 BLACK + z가 'inner' 자식 (LR 또는 RL 형태)",
          when: "z가 부모의 오른쪽 자식이고 부모가 grandparent의 왼쪽 자식 (또는 대칭).",
          action: "부모를 중심으로 회전 → Case 3 형태로 변환.",
          diagram: `   G (BLACK)            G (BLACK)
   / \\                  / \\
  P(R) U(B)    →       z(R) U(B)   ← 회전 후
   \\                   /
   z(R)              P(R)`,
          note: "이 케이스 자체로는 끝나지 않음 — Case 3으로 떨어뜨리기 위한 변환.",
        },
        {
          name: "Case 3: Uncle이 BLACK + z가 'outer' 자식 (LL 또는 RR 형태)",
          when: "z, 부모, grandparent가 일직선.",
          action: "1) 부모 → BLACK, grandparent → RED. 2) grandparent를 중심으로 회전. → 끝.",
          diagram: `   G (BLACK)            P (BLACK) ← 새 루트
   / \\                  / \\
  P(R) U(B)    →       z(R) G(R)
  /                          \\
 z(R)                         U(B)`,
          note: "이 케이스에서 복구 완료. 회전 + 색 변경.",
        },
      ],
    },
    insertCode: {
      title: "Red-Black 삽입 — Java 구현 (핵심)",
      code: `enum Color { RED, BLACK }

class RBNode {
    int key;
    Color color;
    RBNode left, right, parent;
    RBNode(int key) { this.key = key; this.color = Color.RED; }
}

class RBTree {
    RBNode root;
    // NIL: 모든 leaf를 가리키는 sentinel (BLACK)
    private final RBNode NIL = new RBNode(0);
    { NIL.color = Color.BLACK; }

    public void insert(int key) {
        RBNode z = new RBNode(key);
        z.left = z.right = NIL;

        // 1. 일반 BST 삽입 (parent 추적)
        RBNode y = null, x = root;
        while (x != null && x != NIL) {
            y = x;
            x = key < x.key ? x.left : x.right;
        }
        z.parent = y;
        if (y == null) root = z;
        else if (key < y.key) y.left = z;
        else y.right = z;

        // 2. 색깔 복구 (z는 RED로 시작)
        insertFixup(z);
    }

    private void insertFixup(RBNode z) {
        while (z.parent != null && z.parent.color == Color.RED) {
            RBNode gp = z.parent.parent;
            if (z.parent == gp.left) {
                RBNode uncle = gp.right;
                // Case 1: uncle RED — 색만 바꾸고 위로
                if (uncle.color == Color.RED) {
                    z.parent.color = Color.BLACK;
                    uncle.color    = Color.BLACK;
                    gp.color       = Color.RED;
                    z = gp;
                } else {
                    // Case 2: z가 inner (오른쪽) — 회전으로 outer로 변환
                    if (z == z.parent.right) {
                        z = z.parent;
                        leftRotate(z);
                    }
                    // Case 3: z가 outer (왼쪽) — 색 바꾸고 회전
                    z.parent.color = Color.BLACK;
                    gp.color       = Color.RED;
                    rightRotate(gp);
                }
            } else {
                // 대칭 (parent가 오른쪽 자식일 때)
                RBNode uncle = gp.left;
                if (uncle.color == Color.RED) {
                    z.parent.color = Color.BLACK;
                    uncle.color    = Color.BLACK;
                    gp.color       = Color.RED;
                    z = gp;
                } else {
                    if (z == z.parent.left) {
                        z = z.parent;
                        rightRotate(z);
                    }
                    z.parent.color = Color.BLACK;
                    gp.color       = Color.RED;
                    leftRotate(gp);
                }
            }
        }
        root.color = Color.BLACK;  // 속성 2 보장
    }

    // leftRotate, rightRotate는 AVL과 동일한 패턴
    // (단, parent 포인터도 업데이트 필요)
}`,
      note: "삭제는 더 복잡함 — '이중 BLACK' 개념과 4가지 fixup 케이스가 등장. 면접에선 보통 삽입까지만 묻고, 삭제는 '복잡해서 외우기 어렵다, 라이브러리 쓴다'고 답해도 OK.",
    },
    summary: [
      "5가지 속성을 코드 레벨에서 유지하면 자동으로 균형. 외우는 게 출발점.",
      "삽입한 노드는 항상 RED. 부모도 RED면 fixup으로 복구.",
      "Uncle 색깔에 따라 3가지 케이스: RED → 재색칠 후 위로 / BLACK + inner → 회전 후 Case 3 / BLACK + outer → 회전 + 재색칠.",
      "AVL보다 회전 적음 (삽입 시 최대 2회). 트리는 약간 더 높지만 쓰기가 빈번할 때 유리.",
      "Java TreeMap, C++ std::map, Linux 커널의 CFS 스케줄러가 모두 RB 트리.",
    ],
  },
  summary: {
    title: "핵심 개념 정리",
    items: [
      { label: "BST 속성", text: "left < node < right. 이 단순 규칙 하나가 O(log n) 검색의 기반." },
      { label: "삽입", text: "비교하며 내려가 NULL 지점에 부착. O(h)." },
      { label: "삭제", text: "leaf → 제거, 자식 1개 → 대체, 자식 2개 → in-order successor로 대체 후 제거." },
      { label: "In-order 순회", text: "BST의 가장 중요한 속성: 정렬된 순서로 방문. 정렬된 배열을 얻을 수 있음." },
      { label: "최악 케이스", text: "정렬된 입력 → 편향 트리 → 연결 리스트와 동일한 O(n). 균형 트리로 해결." },
      { label: "AVL Balance Factor", text: "BF = h(left) - h(right). |BF| ≤ 1. LL/RR/LR/RL 4가지 회전 케이스로 복원." },
      { label: "AVL 회전", text: "한 번의 삽입은 최대 1회 (LL/RR) 또는 2-step (LR/RL) 회전으로 균형 복원. 모두 O(1)." },
      { label: "Red-Black 5속성", text: "Root BLACK, RED 자식 BLACK, 모든 경로 같은 BLACK 수. 색만으로 균형 보장." },
      { label: "Red-Black 삽입 fixup", text: "Uncle RED → 재색칠. Uncle BLACK + inner → 회전 후 Case 3으로. Uncle BLACK + outer → 회전 + 재색칠." },
      { label: "AVL vs RB", text: "AVL은 검색 빠르고 회전 많음. RB는 쓰기 빠르고 약간 높음. 실무 라이브러리는 RB가 표준." },
      { label: "B-Tree와의 차이", text: "BST는 자식 2개, B-Tree는 다수. 디스크 페이지 단위 I/O에 최적화 → DB 인덱스에 사용." },
    ],
  },
};

const EN = {
  breadcrumb: {
    home: "cs-canvas",
    parent: "data-structures",
    current: "binary search trees",
  },
  hero: {
    title: "Binary Search Trees",
    desc: "Combines the fast search of a sorted array with the fast insert of a linked list.\nBalanced → O(log n). Skewed → O(n). Balance is everything.",
    tags: ["BST property", "Insert/Delete", "Traversal", "Balanced trees", "AVL", "Red-Black"],
  },
  sections: [
    {
      number: "01",
      title: "BST Property",
      desc: "For every node X: all keys in left subtree < X.key < all keys in right subtree. This single invariant gives you logarithmic search on sorted data.",
    },
    {
      number: "02",
      title: "Insert — Walk Down and Attach",
      desc: "Start at root. Smaller key → go left, bigger → go right. On NULL, attach the new node there. O(h) — O(log n) when balanced.",
    },
    {
      number: "03",
      title: "Delete — Three Cases",
      desc: "Zero children: just remove. One child: replace with the child. Two children: replace with right subtree's minimum (in-order successor), then delete that.",
    },
    {
      number: "04",
      title: "Traversals — In/Pre/Post/Level Order",
      desc: "In-order (L-N-R): sorted output. Pre-order (N-L-R): clone tree. Post-order (L-R-N): delete tree, postfix eval. Level-order (BFS): by depth.",
    },
    {
      number: "05",
      title: "When Balance Breaks — O(n) Worst",
      desc: "Insert already-sorted data in order → tree degenerates to a linked list. Search/insert/delete become O(n). Fix: self-balancing trees (AVL, Red-Black, B-Tree).",
    },
    {
      number: "06",
      title: "Self-Balancing — AVL vs Red-Black",
      desc: "AVL: strict balance (height diff ≤ 1), fast search, many rotations. Red-Black: loose balance (only black-height matches), faster insert/delete. Most std libraries use Red-Black.",
    },
  ],
  property: {
    title: "Example BST",
    diagram: `         8
        / \\
       3   10
      / \\    \\
     1   6    14
        / \\   /
       4   7 13`,
    invariant: "For every node X: left subtree < X < right subtree",
    inOrder: "In-order: 1, 3, 4, 6, 7, 8, 10, 13, 14 (sorted)",
  },
  insertExample: {
    title: "Insert — adding 5 to the tree above",
    steps: [
      "1. Compare with root 8: 5 < 8 → go left",
      "2. Compare with 3: 5 > 3 → go right",
      "3. Compare with 6: 5 < 6 → go left",
      "4. Compare with 4: 5 > 4 → go right",
      "5. NULL → attach 5 as right child of 4",
    ],
  },
  deleteCase: {
    title: "3 Deletion Cases",
    cases: [
      {
        name: "Case 1: leaf",
        desc: "No children",
        example: "delete(13): just set parent(14)'s child pointer to NULL",
      },
      {
        name: "Case 2: one child",
        desc: "Single child",
        example: "delete(10): pull up the child (14) into 10's position",
      },
      {
        name: "Case 3: two children",
        desc: "Use successor",
        example: "delete(3): copy right-subtree-min (4) into 3's slot, then delete the original 4",
      },
    ],
  },
  traversal: {
    title: "Traversal Comparison",
    headers: ["Traversal", "Order", "Result (tree above)"],
    rows: [
      ["In-order", "L → N → R", "1, 3, 4, 6, 7, 8, 10, 13, 14"],
      ["Pre-order", "N → L → R", "8, 3, 1, 6, 4, 7, 10, 14, 13"],
      ["Post-order", "L → R → N", "1, 4, 7, 6, 3, 13, 14, 10, 8"],
      ["Level-order", "BFS with queue", "8, 3, 10, 1, 6, 14, 4, 7, 13"],
    ],
  },
  unbalanced: {
    title: "Unbalanced BST — insert sorted [1,2,3,4,5]",
    diagram: `1
 \\
  2
   \\
    3
     \\
      4
       \\
        5`,
    note: "Same as a linked list — search/insert/delete all O(n)",
  },
  complexity: {
    title: "Complexity Comparison",
    headers: ["Op", "Average (balanced)", "Worst (skewed)", "AVL/RB"],
    rows: [
      ["Search", "O(log n)", "O(n)", "O(log n) guaranteed"],
      ["Insert", "O(log n)", "O(n)", "O(log n) guaranteed"],
      ["Delete", "O(log n)", "O(n)", "O(log n) guaranteed"],
      ["Min/Max", "O(log n)", "O(n)", "O(log n) guaranteed"],
      ["In-order traversal", "O(n)", "O(n)", "O(n)"],
    ],
  },
  balancedCompare: {
    title: "AVL vs Red-Black",
    headers: ["", "AVL", "Red-Black"],
    rows: [
      ["Balance criterion", "Height diff ≤ 1", "Black height equal"],
      ["Tree height", "Lower (≤ 1.44 log n)", "Higher (≤ 2 log n)"],
      ["Search", "Faster", "Slightly slower"],
      ["Insert/Delete", "More rotations → slower", "Fewer rotations → faster"],
      ["Where used", "Read-heavy (DB indexes)", "General (C++ map, Java TreeMap)"],
    ],
  },
  bstImpl: {
    title: "Full BST Implementation — Java",
    intro: "Recursive implementation is cleanest. Pattern: each method takes a subtree root and returns the (possibly new) root of that subtree.",
    code: `class Node {
    int key;
    Node left, right;
    Node(int key) { this.key = key; }
}

class BST {
    Node root;

    // Search — O(h)
    public boolean search(int key) {
        return searchRec(root, key);
    }
    private boolean searchRec(Node node, int key) {
        if (node == null) return false;
        if (key == node.key) return true;
        return key < node.key
            ? searchRec(node.left, key)
            : searchRec(node.right, key);
    }

    // Insert — O(h)
    public void insert(int key) {
        root = insertRec(root, key);
    }
    private Node insertRec(Node node, int key) {
        if (node == null) return new Node(key);
        if (key < node.key)      node.left  = insertRec(node.left, key);
        else if (key > node.key) node.right = insertRec(node.right, key);
        // duplicates ignored (policy choice)
        return node;
    }

    // Delete — O(h), three cases
    public void delete(int key) {
        root = deleteRec(root, key);
    }
    private Node deleteRec(Node node, int key) {
        if (node == null) return null;
        if (key < node.key)      node.left  = deleteRec(node.left, key);
        else if (key > node.key) node.right = deleteRec(node.right, key);
        else {
            // found — handle the 3 cases
            if (node.left == null)  return node.right;  // cases 1, 2
            if (node.right == null) return node.left;
            // case 3: two children — replace with in-order successor
            Node successor = minNode(node.right);
            node.key = successor.key;
            node.right = deleteRec(node.right, successor.key);
        }
        return node;
    }
    private Node minNode(Node node) {
        while (node.left != null) node = node.left;
        return node;
    }

    // In-order traversal — sorted output
    public void inorder() {
        inorderRec(root);
    }
    private void inorderRec(Node node) {
        if (node == null) return;
        inorderRec(node.left);
        System.out.print(node.key + " ");
        inorderRec(node.right);
    }
}`,
    keypoints: [
      "Each recursive method returns a node; the caller reassigns its left/right. Parent-child pointer fixup happens in a single line.",
      "The two-children delete case is the trick: copy successor's key in place, then delete that successor (which now has at most one child).",
      "Without balancing, worst case is O(n). Inserting sorted [1, 2, 3, ...] makes it a linked list — the reason AVL/RB exist.",
    ],
  },
  avl: {
    title: "AVL Tree — Strictly Balanced BST",
    intro: "Invented in 1962 by Adelson-Velsky and Landis. The first self-balancing BST.\nCore rule: for every node, the heights of its two children differ by at most 1.",
    balanceFactor: {
      title: "Balance Factor (BF)",
      desc: "BF(node) = height(node.left) − height(node.right). Only -1, 0, 1 are allowed. If |BF| ≥ 2, rebalance with a rotation.",
      example: `        10 (BF=0)
       /  \\
      5    15 (BF=-1)
     /       \\
    3         20

|BF| ≤ 1 at every node → it's an AVL tree.`,
    },
    rotations: {
      title: "The Four Rotation Cases",
      desc: "After insert/delete, if |BF| > 1, which side caused the imbalance determines one of four cases. Each has a fixed rotation pattern.",
      cases: [
        {
          name: "LL Case — Right Rotation",
          when: "z.left.left subtree is heavy (insertion went left-left).",
          before: `      z (BF=2)
     /
    y (BF=1)
   /
  x   ← newly inserted`,
          after: `    y
   / \\
  x   z`,
          rotation: "Right-rotate around z: y becomes the new root, z becomes y's right child.",
        },
        {
          name: "RR Case — Left Rotation",
          when: "z.right.right subtree is heavy. Mirror of LL.",
          before: `  z (BF=-2)
   \\
    y (BF=-1)
     \\
      x   ← newly inserted`,
          after: `    y
   / \\
  z   x`,
          rotation: "Left-rotate around z: y becomes the new root, z becomes y's left child.",
        },
        {
          name: "LR Case — Left then Right",
          when: "z.left.right subtree is heavy. A single rotation isn't enough.",
          before: `    z (BF=2)
   /
  y (BF=-1)
   \\
    x   ← newly inserted`,
          intermediate: `    z
   /
  x       ← after left-rotate(y)
 /
y`,
          after: `    x
   / \\
  y   z`,
          rotation: "1) Left-rotate around y → reduces to LL shape. 2) Right-rotate around z.",
        },
        {
          name: "RL Case — Right then Left",
          when: "z.right.left subtree is heavy. Mirror of LR.",
          before: `  z (BF=-2)
   \\
    y (BF=1)
   /
  x   ← newly inserted`,
          intermediate: `  z
   \\
    x       ← after right-rotate(y)
     \\
      y`,
          after: `    x
   / \\
  z   y`,
          rotation: "1) Right-rotate around y → reduces to RR shape. 2) Left-rotate around z.",
        },
      ],
    },
    rotationCode: {
      title: "Rotations — Java",
      code: `// Right rotation: LL case where y = z.left, x = y.left
//
//      z              y
//     / \\            / \\
//    y   T4  -->    x   z
//   / \\                / \\
//  x   T3             T3  T4
//
private Node rightRotate(Node z) {
    Node y = z.left;
    Node T3 = y.right;
    // perform rotation
    y.right = z;
    z.left  = T3;
    // update heights (z first, then y — z is now y's child)
    z.height = 1 + Math.max(height(z.left), height(z.right));
    y.height = 1 + Math.max(height(y.left), height(y.right));
    return y;  // new root of this subtree
}

// Left rotation: mirror
private Node leftRotate(Node z) {
    Node y = z.right;
    Node T2 = y.left;
    y.left  = z;
    z.right = T2;
    z.height = 1 + Math.max(height(z.left), height(z.right));
    y.height = 1 + Math.max(height(y.left), height(y.right));
    return y;
}`,
    },
    insertCode: {
      title: "Insert — Java with Rebalancing",
      code: `class AVLNode {
    int key, height;
    AVLNode left, right;
    AVLNode(int key) { this.key = key; this.height = 1; }
}

class AVLTree {
    AVLNode root;

    private int height(AVLNode n) { return n == null ? 0 : n.height; }
    private int bf(AVLNode n) {
        return n == null ? 0 : height(n.left) - height(n.right);
    }

    public void insert(int key) { root = insertRec(root, key); }

    private AVLNode insertRec(AVLNode node, int key) {
        // 1. Standard BST insert
        if (node == null) return new AVLNode(key);
        if (key < node.key)      node.left  = insertRec(node.left, key);
        else if (key > node.key) node.right = insertRec(node.right, key);
        else return node;  // ignore duplicates

        // 2. Update height
        node.height = 1 + Math.max(height(node.left), height(node.right));

        // 3. Check balance factor and branch on the 4 cases
        int balance = bf(node);

        // LL — left-heavy, new key went left of left child
        if (balance > 1 && key < node.left.key)
            return rightRotate(node);

        // RR — right-heavy, new key went right of right child
        if (balance < -1 && key > node.right.key)
            return leftRotate(node);

        // LR — left-heavy, new key went right of left child
        if (balance > 1 && key > node.left.key) {
            node.left = leftRotate(node.left);
            return rightRotate(node);
        }

        // RL — right-heavy, new key went left of right child
        if (balance < -1 && key < node.right.key) {
            node.right = rightRotate(node.right);
            return leftRotate(node);
        }

        return node;  // already balanced
    }
}`,
      note: "Balance is checked as recursion unwinds. A single insert needs at most one rotation (or 2-step), all O(1) → total O(log n).",
    },
    summary: [
      "Balance Factor: BF = height(left) − height(right). Keep |BF| ≤ 1.",
      "On insert/delete, check BF as recursion returns up the tree.",
      "Four cases (LL/RR/LR/RL) determine 1 or 2 rotations.",
      "All rotations are O(1). Tree height stays ≤ 1.44 log n — strict.",
      "Fast searches, but rotations on every write make it more expensive than Red-Black.",
    ],
  },
  rb: {
    title: "Red-Black Tree — Loosely Balanced",
    intro: "Proposed by Bayer in 1972 ('symmetric binary B-tree'), formalized by Guibas & Sedgewick in 1978.\nCore rule: assign each node a RED or BLACK color, then enforce balance indirectly through coloring rules.",
    properties: {
      title: "The Five Red-Black Properties — Memorize These",
      list: [
        { n: "1", rule: "Every node is RED or BLACK." },
        { n: "2", rule: "The root is always BLACK." },
        { n: "3", rule: "Every NIL leaf (null child) is treated as BLACK." },
        { n: "4", rule: "A RED node's children must be BLACK (no consecutive REDs)." },
        { n: "5", rule: "Every path from a node to its descendant NILs contains the same number of BLACK nodes (the black-height)." },
      ],
      why: "Why do these guarantee balance? Property 4 (no double RED) plus Property 5 (equal BLACK counts) means the longest path ≤ 2 × the shortest path. So height ≤ 2 log(n+1).",
    },
    intuition: {
      title: "Why So Complicated — Intuition",
      desc: "AVL measures balance precisely (with BF). RB enforces it loosely (with colors). Colors can be changed without rotating → fewer rotations on writes. The tree is slightly taller (≤ 2 log n vs AVL's 1.44 log n), but cheaper write paths win in write-heavy workloads.",
      simpleAnalogy: "AVL = 'heights must differ by at most 1 cm' (strict). RB = 'roughly the same height is fine' (loose). RB checks less, but both stay O(log n).",
    },
    insertFixup: {
      title: "Insertion Fixup — Three Cases",
      intro: "A newly inserted node is always colored RED (so as not to break property 5's black-height). If its parent is also RED, property 4 is violated and we fix it. The fix depends on the color of the uncle (parent's sibling).",
      cases: [
        {
          name: "Case 1: Uncle is RED",
          when: "Both parent and uncle are RED.",
          action: "Recolor only: parent and uncle → BLACK, grandparent → RED. Then treat grandparent as the new z and continue checking upward.",
          diagram: `   G (BLACK)              G (RED) ← new z
   / \\                    / \\
  P(R) U(R)    →        P(B) U(B)
  /                      /
 z(R)                   z(R)`,
          note: "No rotation, just recoloring. The 'problem' may propagate up via grandparent.",
        },
        {
          name: "Case 2: Uncle BLACK + z is an 'inner' child (LR or RL shape)",
          when: "z is parent's right child while parent is grandparent's left child (or the mirror).",
          action: "Rotate around the parent to transform into Case 3.",
          diagram: `   G (BLACK)            G (BLACK)
   / \\                  / \\
  P(R) U(B)    →       z(R) U(B)   ← after rotation
   \\                   /
   z(R)              P(R)`,
          note: "Doesn't finish on its own — sets up Case 3.",
        },
        {
          name: "Case 3: Uncle BLACK + z is an 'outer' child (LL or RR shape)",
          when: "z, parent, grandparent are in a straight line.",
          action: "1) parent → BLACK, grandparent → RED. 2) Rotate around grandparent. Done.",
          diagram: `   G (BLACK)            P (BLACK) ← new root
   / \\                  / \\
  P(R) U(B)    →       z(R) G(R)
  /                          \\
 z(R)                         U(B)`,
          note: "This case finishes the fixup. Rotation + recoloring.",
        },
      ],
    },
    insertCode: {
      title: "Red-Black Insert — Java (core)",
      code: `enum Color { RED, BLACK }

class RBNode {
    int key;
    Color color;
    RBNode left, right, parent;
    RBNode(int key) { this.key = key; this.color = Color.RED; }
}

class RBTree {
    RBNode root;
    // NIL: sentinel for all leaves (always BLACK)
    private final RBNode NIL = new RBNode(0);
    { NIL.color = Color.BLACK; }

    public void insert(int key) {
        RBNode z = new RBNode(key);
        z.left = z.right = NIL;

        // 1. Standard BST insert (tracking parent)
        RBNode y = null, x = root;
        while (x != null && x != NIL) {
            y = x;
            x = key < x.key ? x.left : x.right;
        }
        z.parent = y;
        if (y == null) root = z;
        else if (key < y.key) y.left = z;
        else y.right = z;

        // 2. Fix coloring (z starts RED)
        insertFixup(z);
    }

    private void insertFixup(RBNode z) {
        while (z.parent != null && z.parent.color == Color.RED) {
            RBNode gp = z.parent.parent;
            if (z.parent == gp.left) {
                RBNode uncle = gp.right;
                // Case 1: uncle RED — recolor, move up
                if (uncle.color == Color.RED) {
                    z.parent.color = Color.BLACK;
                    uncle.color    = Color.BLACK;
                    gp.color       = Color.RED;
                    z = gp;
                } else {
                    // Case 2: z is inner (right child) — rotate to outer
                    if (z == z.parent.right) {
                        z = z.parent;
                        leftRotate(z);
                    }
                    // Case 3: z is outer (left child) — recolor + rotate
                    z.parent.color = Color.BLACK;
                    gp.color       = Color.RED;
                    rightRotate(gp);
                }
            } else {
                // Mirror (parent is the right child)
                RBNode uncle = gp.left;
                if (uncle.color == Color.RED) {
                    z.parent.color = Color.BLACK;
                    uncle.color    = Color.BLACK;
                    gp.color       = Color.RED;
                    z = gp;
                } else {
                    if (z == z.parent.left) {
                        z = z.parent;
                        rightRotate(z);
                    }
                    z.parent.color = Color.BLACK;
                    gp.color       = Color.RED;
                    leftRotate(gp);
                }
            }
        }
        root.color = Color.BLACK;  // enforce property 2
    }

    // leftRotate, rightRotate follow the AVL pattern
    // (but also update parent pointers)
}`,
      note: "Delete is harder — it brings in the 'double-black' concept and four fixup cases. In interviews, knowing insert is usually enough; for delete, it's fine to say 'too gnarly to memorize — I'd reach for the library.'",
    },
    summary: [
      "Five properties enforced in code → balance falls out automatically. Start by memorizing them.",
      "Newly inserted nodes are always RED. If parent is also RED, fixup is required.",
      "Three cases by uncle color: RED → recolor and continue up. BLACK + inner → rotate then Case 3. BLACK + outer → rotate and recolor.",
      "Fewer rotations than AVL (insert costs at most 2). Slightly taller tree, but better for write-heavy workloads.",
      "Used by Java TreeMap, C++ std::map, and the Linux kernel's CFS scheduler.",
    ],
  },
  summary: {
    title: "Key Concepts",
    items: [
      { label: "BST property", text: "left < node < right. That single rule enables O(log n) search." },
      { label: "Insert", text: "Walk down comparing keys; attach at the NULL slot. O(h)." },
      { label: "Delete", text: "Leaf → remove. One child → replace with child. Two children → swap with in-order successor, then delete that." },
      { label: "In-order traversal", text: "The most important BST property: visits in sorted order. Yields a sorted array." },
      { label: "Worst case", text: "Sorted input → skewed tree → linked-list-style O(n). Fix with balanced trees." },
      { label: "AVL Balance Factor", text: "BF = h(left) − h(right). |BF| ≤ 1. Four rotation cases (LL/RR/LR/RL) restore balance." },
      { label: "AVL rotations", text: "One insert needs at most one (LL/RR) or two-step (LR/RL) rotation. All O(1)." },
      { label: "RB five properties", text: "Root BLACK, RED children BLACK, equal black-heights — color alone enforces balance." },
      { label: "RB insert fixup", text: "Uncle RED → recolor. Uncle BLACK + inner → rotate into Case 3. Uncle BLACK + outer → rotate + recolor." },
      { label: "AVL vs RB", text: "AVL: faster lookup, more rotations. RB: faster writes, slightly taller. Production libraries pick RB." },
      { label: "vs B-Tree", text: "BST has 2 children; B-Tree has many. B-Tree is optimized for disk page I/O → DB indexes." },
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

export default function BSTPage() {
  const { lang } = useLanguage();
  const t = lang === "ko" ? KO : EN;

  return (
    <div className="relative min-h-screen bg-grid-pattern">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(52,211,153,0.05),transparent)]" />

      <div className="relative mx-auto max-w-4xl px-6 py-16">
        {/* breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-600 mb-10">
          <Link href="/" className="hover:text-zinc-400 transition-colors">
            {t.breadcrumb.home}
          </Link>
          <span>/</span>
          <Link href="/data-structures" className="hover:text-zinc-400 transition-colors">
            {t.breadcrumb.parent}
          </Link>
          <span>/</span>
          <span className="text-zinc-400">{t.breadcrumb.current}</span>
        </div>

        {/* hero */}
        <div className="mb-16">
          <h1 className="text-3xl font-bold text-white font-mono mb-4">
            {t.hero.title}
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed max-w-2xl mb-6 whitespace-pre-line">
            {t.hero.desc}
          </p>
          <div className="flex items-center gap-0 text-xs font-mono flex-wrap">
            {t.hero.tags.map((label, i, arr) => (
              <span key={label} className="flex items-center">
                <span className="text-zinc-500 px-2 py-1 rounded border border-white/[0.06] bg-white/[0.02]">
                  {label}
                </span>
                {i < arr.length - 1 && (
                  <span className="text-zinc-700 mx-1.5">→</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* 01 - property */}
        <Section
          number={t.sections[0].number}
          title={t.sections[0].title}
          description={t.sections[0].desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">
              {t.property.title}
            </h3>
            <pre className="text-[11px] font-mono text-emerald-300 mb-4">
              {t.property.diagram}
            </pre>
            <div className="space-y-2">
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                <div className="text-[10px] text-zinc-500 font-mono mb-1">
                  {lang === "ko" ? "불변 규칙" : "Invariant"}
                </div>
                <p className="text-[11px] text-emerald-300/80">{t.property.invariant}</p>
              </div>
              <div className="rounded-lg border border-zinc-700/40 bg-zinc-900/30 p-3">
                <p className="text-[11px] text-zinc-400">{t.property.inOrder}</p>
              </div>
            </div>
          </div>
        </Section>

        {/* 02 - insert */}
        <Section
          number={t.sections[1].number}
          title={t.sections[1].title}
          description={t.sections[1].desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">
              {t.insertExample.title}
            </h3>
            <div className="space-y-1">
              {t.insertExample.steps.map((s, i) => (
                <div key={i} className="text-[11px] font-mono text-zinc-400">
                  {s}
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* 03 - delete */}
        <Section
          number={t.sections[2].number}
          title={t.sections[2].title}
          description={t.sections[2].desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">
              {t.deleteCase.title}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {t.deleteCase.cases.map((c) => (
                <div
                  key={c.name}
                  className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4"
                >
                  <div className="text-xs font-mono text-emerald-300 font-semibold mb-1">
                    {c.name}
                  </div>
                  <div className="text-[10px] text-zinc-500 mb-2">{c.desc}</div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    {c.example}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* 04 - traversal */}
        <Section
          number={t.sections[3].number}
          title={t.sections[3].title}
          description={t.sections[3].desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  {t.traversal.headers.map((h, i) => (
                    <th
                      key={i}
                      className={`text-left py-2 ${
                        i === 0 ? "text-emerald-400 w-28" : i === 1 ? "text-zinc-500 w-32" : "text-zinc-400"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.traversal.rows.map((row, i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    <td className="py-2 text-emerald-300/80 font-semibold">{row[0]}</td>
                    <td className="py-2 text-zinc-500">{row[1]}</td>
                    <td className="py-2 text-zinc-400">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* 05 - unbalanced */}
        <Section
          number={t.sections[4].number}
          title={t.sections[4].title}
          description={t.sections[4].desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-xs font-mono text-zinc-400 mb-3">
                  {t.unbalanced.title}
                </h3>
                <pre className="text-[11px] font-mono text-red-300/80">
                  {t.unbalanced.diagram}
                </pre>
                <p className="text-[10px] text-red-400/80 mt-3 italic">
                  {t.unbalanced.note}
                </p>
              </div>
              <div>
                <h3 className="text-xs font-mono text-zinc-400 mb-3">
                  {t.complexity.title}
                </h3>
                <table className="w-full text-[10px] font-mono">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      {t.complexity.headers.map((h, i) => (
                        <th key={i} className="text-left py-1 text-zinc-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {t.complexity.rows.map((row, i) => (
                      <tr key={i} className="border-b border-zinc-800/50">
                        {row.map((cell, j) => (
                          <td
                            key={j}
                            className={`py-1 ${
                              j === 0
                                ? "text-emerald-300/80"
                                : j === 2
                                  ? "text-red-300/70"
                                  : "text-zinc-400"
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Section>

        {/* 06 - AVL vs RB */}
        <Section
          number={t.sections[5].number}
          title={t.sections[5].title}
          description={t.sections[5].desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  {t.balancedCompare.headers.map((h, i) => (
                    <th
                      key={i}
                      className={`text-left py-2 ${
                        i === 0 ? "text-zinc-600 w-32" : i === 1 ? "text-emerald-400" : "text-cyan-400"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.balancedCompare.rows.map((row, i) => (
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

        {/* 07 - BST Java implementation */}
        <Section number="07" title={t.bstImpl.title} description={t.bstImpl.intro}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <pre className="text-[11px] font-mono text-zinc-300 leading-relaxed bg-zinc-900/30 p-4 rounded overflow-x-auto">{t.bstImpl.code}</pre>
            <div className="mt-4 space-y-2">
              {t.bstImpl.keypoints.map((kp, i) => (
                <div key={i} className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                  <p className="text-[11px] text-zinc-400 leading-relaxed">💡 {kp}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* 08 - AVL deep dive */}
        <Section number="08" title={t.avl.title} description={t.avl.intro}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-5">
            {/* Balance Factor */}
            <div>
              <h4 className="text-xs font-mono text-cyan-300 mb-2 font-semibold">
                {t.avl.balanceFactor.title}
              </h4>
              <p className="text-[11px] text-zinc-500 mb-3">{t.avl.balanceFactor.desc}</p>
              <pre className="text-[11px] font-mono text-cyan-300/80 leading-relaxed bg-zinc-900/30 p-3 rounded">{t.avl.balanceFactor.example}</pre>
            </div>

            {/* 4 rotation cases */}
            <div className="border-t border-zinc-800 pt-5">
              <h4 className="text-xs font-mono text-cyan-300 mb-2 font-semibold">
                {t.avl.rotations.title}
              </h4>
              <p className="text-[11px] text-zinc-500 mb-4">{t.avl.rotations.desc}</p>
              <div className="space-y-3">
                {t.avl.rotations.cases.map((c) => (
                  <div key={c.name} className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4">
                    <div className="text-xs font-mono text-cyan-300 font-semibold mb-2">{c.name}</div>
                    <p className="text-[11px] text-zinc-400 mb-3">{c.when}</p>
                    <div className={`grid ${("intermediate" in c) ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"} gap-3`}>
                      <div>
                        <div className="text-[10px] font-mono text-red-400 mb-1">{lang === "ko" ? "회전 전 (불균형)" : "Before (unbalanced)"}</div>
                        <pre className="text-[10px] font-mono text-zinc-400 bg-black/30 p-2 rounded">{c.before}</pre>
                      </div>
                      {"intermediate" in c && c.intermediate && (
                        <div>
                          <div className="text-[10px] font-mono text-amber-400 mb-1">{lang === "ko" ? "1차 회전 후" : "After first rotation"}</div>
                          <pre className="text-[10px] font-mono text-zinc-400 bg-black/30 p-2 rounded">{c.intermediate}</pre>
                        </div>
                      )}
                      <div>
                        <div className="text-[10px] font-mono text-emerald-400 mb-1">{lang === "ko" ? "회전 후 (균형)" : "After (balanced)"}</div>
                        <pre className="text-[10px] font-mono text-zinc-400 bg-black/30 p-2 rounded">{c.after}</pre>
                      </div>
                    </div>
                    <p className="text-[10px] text-zinc-500 italic mt-2">→ {c.rotation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Rotation Java code */}
            <div className="border-t border-zinc-800 pt-5">
              <h4 className="text-xs font-mono text-cyan-300 mb-3 font-semibold">{t.avl.rotationCode.title}</h4>
              <pre className="text-[11px] font-mono text-zinc-300 leading-relaxed bg-zinc-900/30 p-4 rounded overflow-x-auto">{t.avl.rotationCode.code}</pre>
            </div>

            {/* Insert Java code */}
            <div className="border-t border-zinc-800 pt-5">
              <h4 className="text-xs font-mono text-cyan-300 mb-3 font-semibold">{t.avl.insertCode.title}</h4>
              <pre className="text-[11px] font-mono text-zinc-300 leading-relaxed bg-zinc-900/30 p-4 rounded overflow-x-auto">{t.avl.insertCode.code}</pre>
              <p className="text-[10px] text-zinc-500 italic mt-3">💡 {t.avl.insertCode.note}</p>
            </div>

            {/* AVL summary */}
            <div className="border-t border-zinc-800 pt-5">
              <h4 className="text-xs font-mono text-cyan-300 mb-2 font-semibold">
                {lang === "ko" ? "AVL 한 줄 요약" : "AVL Quick Recap"}
              </h4>
              <ul className="space-y-1.5">
                {t.avl.summary.map((s, i) => (
                  <li key={i} className="text-[11px] text-zinc-400 leading-relaxed flex gap-2">
                    <span className="text-cyan-400">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* 09 - Red-Black deep dive */}
        <Section number="09" title={t.rb.title} description={t.rb.intro}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-5">
            {/* 5 properties */}
            <div>
              <h4 className="text-xs font-mono text-rose-300 mb-3 font-semibold">
                {t.rb.properties.title}
              </h4>
              <div className="space-y-1.5">
                {t.rb.properties.list.map((p) => (
                  <div key={p.n} className="flex items-baseline gap-3 text-[11px] font-mono">
                    <span className="text-rose-400 font-bold w-6">{p.n}.</span>
                    <span className="text-zinc-400">{p.rule}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-lg border border-rose-500/20 bg-rose-500/5 p-3">
                <p className="text-[11px] text-rose-300/80 leading-relaxed">💡 {t.rb.properties.why}</p>
              </div>
            </div>

            {/* Intuition */}
            <div className="border-t border-zinc-800 pt-5">
              <h4 className="text-xs font-mono text-rose-300 mb-2 font-semibold">
                {t.rb.intuition.title}
              </h4>
              <p className="text-[11px] text-zinc-500 mb-3 leading-relaxed">{t.rb.intuition.desc}</p>
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                <p className="text-[11px] text-amber-300/80 italic">🔍 {t.rb.intuition.simpleAnalogy}</p>
              </div>
            </div>

            {/* Insert fixup 3 cases */}
            <div className="border-t border-zinc-800 pt-5">
              <h4 className="text-xs font-mono text-rose-300 mb-2 font-semibold">
                {t.rb.insertFixup.title}
              </h4>
              <p className="text-[11px] text-zinc-500 mb-4">{t.rb.insertFixup.intro}</p>
              <div className="space-y-3">
                {t.rb.insertFixup.cases.map((c) => (
                  <div key={c.name} className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-4">
                    <div className="text-xs font-mono text-rose-300 font-semibold mb-2">{c.name}</div>
                    <p className="text-[11px] text-zinc-400 mb-2"><span className="text-zinc-500">{lang === "ko" ? "조건: " : "When: "}</span>{c.when}</p>
                    <p className="text-[11px] text-zinc-400 mb-3"><span className="text-zinc-500">{lang === "ko" ? "동작: " : "Action: "}</span>{c.action}</p>
                    <pre className="text-[10px] font-mono text-zinc-400 bg-black/30 p-3 rounded">{c.diagram}</pre>
                    <p className="text-[10px] text-zinc-500 italic mt-2">→ {c.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Insert Java code */}
            <div className="border-t border-zinc-800 pt-5">
              <h4 className="text-xs font-mono text-rose-300 mb-3 font-semibold">{t.rb.insertCode.title}</h4>
              <pre className="text-[11px] font-mono text-zinc-300 leading-relaxed bg-zinc-900/30 p-4 rounded overflow-x-auto">{t.rb.insertCode.code}</pre>
              <p className="text-[10px] text-zinc-500 italic mt-3">⚠ {t.rb.insertCode.note}</p>
            </div>

            {/* RB summary */}
            <div className="border-t border-zinc-800 pt-5">
              <h4 className="text-xs font-mono text-rose-300 mb-2 font-semibold">
                {lang === "ko" ? "Red-Black 한 줄 요약" : "Red-Black Quick Recap"}
              </h4>
              <ul className="space-y-1.5">
                {t.rb.summary.map((s, i) => (
                  <li key={i} className="text-[11px] text-zinc-400 leading-relaxed flex gap-2">
                    <span className="text-rose-400">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* summary */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h3 className="text-white font-semibold text-sm font-mono mb-5">
            {t.summary.title}
          </h3>
          <div className="space-y-3">
            {t.summary.items.map((item) => (
              <div key={item.label} className="flex gap-3 items-start">
                <span className="text-xs font-mono text-emerald-500/50 shrink-0 mt-0.5 min-w-[140px]">
                  {item.label}
                </span>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
