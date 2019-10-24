// https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/

class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

class SubtreeState {
  constructor(parent, isLeftChild, inorderLeft, inorderRight) {
    this.parent = parent;
    this.isLeftChild = isLeftChild;
    this.inorderLeft = inorderLeft;
    this.inorderRight = inorderRight;
  }
}

/**
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */
function buildTree(preorder, inorder) {
  if (preorder.length === 0) {
    return null;
  }

  // Used for constant time lookup of a value's index in the inorder array
  const inorderIndexes = {};
  inorder.forEach((value, index) => { inorderIndexes[value] = index });

  // This will be the root of the tree
  let tree;

  const stack = [new SubtreeState(null, null, 0, inorder.length - 1)];
  let preorder_index = 0;
  while (stack.length !== 0) {
    const { parent, isLeftChild, inorderLeft, inorderRight } = stack.pop();
    const currentRoot = new TreeNode(preorder[preorder_index++]);
    const root_inorder_index = inorderIndexes[currentRoot.val];

    if (!parent) {
      // This means currentRoot is the root of the entire tree!
      tree = currentRoot;
    } else if (isLeftChild) {
      parent.left = currentRoot;
    } else {
      parent.right = currentRoot;
    }

    // There are node(s) to the right of the root of this subtree. We process the right side first so
    // the left side is above in the stack and is popped off first later, matching order in preorder.
    if (root_inorder_index < inorderRight) {
      stack.push(new SubtreeState(currentRoot, false, root_inorder_index + 1, inorderRight));
    }

    // There are node(s) to the left of the root of this subtree.
    if (root_inorder_index > inorderLeft) {
      stack.push(new SubtreeState(currentRoot, true, inorderLeft, root_inorder_index - 1));
    }
  }
  return tree;
}

