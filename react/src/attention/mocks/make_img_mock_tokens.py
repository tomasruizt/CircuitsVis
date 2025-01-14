import json

import numpy as np

img_grid_dimensions = (12, 12)
n_img_tokens = img_grid_dimensions[0] * img_grid_dimensions[1]
img_token = "<image>"
cls_token = "[CLS]"
# New token sequence with image tokens in the middle
tokens = [
    "user:",  # Start with a user prefix
    cls_token,  # class token
] + [img_token] * n_img_tokens + [  # Image tokens in the middle
    " Describe",
    " the",
    " image"
]

n_tokens = len(tokens)
# Find where the image tokens start
img_token_start = tokens.index(img_token)
cls_token_start = tokens.index(cls_token)

def make_attn_mask(seed: int) -> np.ndarray:
    np.random.seed(seed)
    # Fully causal mask
    attn_mask = np.tril(np.random.rand(n_tokens, n_tokens))

    # Image tokens attend to each other
    img_token_end = img_token_start + n_img_tokens
    attn_mask[
        cls_token_start:img_token_end, 
        cls_token_start:img_token_end
    ] = np.random.rand(n_img_tokens + 1, n_img_tokens + 1)

    # Normalize
    attn_mask = attn_mask / attn_mask.sum(axis=1, keepdims=True)
    return attn_mask

n_heads = 6
attns_masks = [make_attn_mask(i).round(3).tolist() for i in range(n_heads)]

print("grid dimensions:", img_grid_dimensions)
print("num tokens:", n_tokens)
print("num img tokens:", n_img_tokens)
print("img tokens start at:", img_token_start)
print("num heads:", n_heads)

data = {
    "tokens": tokens,
    "attention": attns_masks,
    "attention_min": np.min(attns_masks),
    "attention_max": np.max(attns_masks),
    "image_grid_dimensions": img_grid_dimensions,
    "img_url": "https://github.com/zazamrykh/PicFinder/blob/main/images/doge.jpg?raw=true",
    "image_tokens_start": img_token_start
}

with open("img_mock_data.json", "w") as f:
    json.dump(data, f, indent=2)
