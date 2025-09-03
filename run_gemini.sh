#!/bin/bash

if [ -f .env.local ]; then
  source .env.local
else
  echo "Error: .env.local not found."
  exit 1
fi

declare -A API_KEYS

for var in "${!GEMINI_API_KEY_@}"; do
  name="${var#GEMINI_API_KEY_}"
  API_KEYS["$name"]="${!var}"
done

if [ ${#API_KEYS[@]} -eq 0 ]; then
  echo "Error: Not found any variable prefixed with 'GEMINI_API_KEY_' in .env.local."
  exit 1
fi

# ---
# 1. API Key Selection
# ---

echo "Which API key would you like to use?"
names=("${!API_KEYS[@]}")
for i in "${!names[@]}"; do
  echo "$((i+1)). ${names[i]}"
done

read -p "Choose a number: " api_choice

# Validate user's input for the API key
if [[ ! "$api_choice" =~ ^[0-9]+$ ]] || ((api_choice < 1 || api_choice > ${#names[@]})); then
  echo "Invalid API key selection. Please choose a number from the list."
  exit 1
fi

SELECTED_API_KEY="${API_KEYS[${names[$((api_choice-1))]}]}"
export GEMINI_API_KEY="$SELECTED_API_KEY"

# ---
# 2. Model Selection
# ---

echo "Which model would you like to use?"
echo "1. gemini-2.5-flash"
echo "2. gemini-2.5-pro"

read -p "Choose a number: " param_choice

# Validate user's input for the model
case "$param_choice" in
  1)
    SELECTED_PARAM="gemini-2.5-flash"
    ;;
  2)
    SELECTED_PARAM="gemini-2.5-pro"
    ;;
  *)
    echo "Invalid selection. Please choose a number from the list."
    exit 1
    ;;
esac

# ---
# 3. Launch the Software
# ---

# Mask the selected key for display purposes
masked_selected_key="...${SELECTED_API_KEY: -4}"

echo "Using API key: ${masked_selected_key}"
echo "Using model: ${SELECTED_PARAM}"

# Launch the software with the selected model
gemini -m "$SELECTED_PARAM"
