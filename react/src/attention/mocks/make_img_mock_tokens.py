import json

import numpy as np

img_grid_dimensions = (24, 24)  # CLIP grid size
n_img_tokens = img_grid_dimensions[0] * img_grid_dimensions[1]
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


print("grid dimensions:", img_grid_dimensions)
print("num tokens:", n_tokens)
print("num img tokens:", n_img_tokens)
print("num heads:", n_heads)


data = {
    "tokens": tokens,
    "attention": attns_masks,
    "attention_min": np.min(attns_masks),
    "attention_max": np.max(attns_masks),
    "image_grid_dimensions": img_grid_dimensions,
    "img_url": "https://github.com/zazamrykh/PicFinder/blob/main/images/doge.jpg?raw=true",
}

with open("img_mock_data.json", "w") as f:
    json.dump(data, f, indent=2)
