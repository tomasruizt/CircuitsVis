import json

import numpy as np

n_img_tokens = 2 * 3
img_token = "<image>"
tokens = [img_token] * n_img_tokens + [
  " What",
  " is",
  " in",
  " the",
  " image",
  " ?"
]

n_tokens = len(tokens)

def make_attn_mask(seed: int) -> np.ndarray:
    np.random.seed(seed)
    # Fully causal mask
    attn_mask = np.tril(np.random.rand(n_tokens, n_tokens))

    # Image tokens attend to each other
    attn_mask[:n_img_tokens, :n_img_tokens] = np.random.rand(n_img_tokens, n_img_tokens)

    # Normalize
    attn_mask = attn_mask / np.sum(attn_mask, axis=1)
    return attn_mask

n_heads = 6
attns_masks = [make_attn_mask(i).round(3).tolist() for i in range(n_heads)]


print("num tokens:", n_tokens)
print("num img tokens:", n_img_tokens)
print("num heads:", n_heads)

with open("mock_tokens.json", "w") as f:
    json.dump(tokens, f, indent=2)

with open("mock_attn_mask.json", "w") as f:
    json.dump(attns_masks, f, indent=2)
