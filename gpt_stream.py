from openai import OpenAI

client = OpenAI()

# Output file path
output_file = "story_output.txt"

with open(output_file, "w", encoding="utf-8") as f:
    # Start streaming
    with client.responses.stream(
        model="gpt-5-mini",
        input="Write a short bedtime story about a friendly robot."
    ) as stream:
        for event in stream:
            if event.type == "response.output_text.delta":
                # Print live to console
                print(event.delta, end="", flush=True)
                # Save to file
                f.write(event.delta)

# Final response object if you need it
final_response = stream.get_final_response()

print(f"\n\n--- Full response saved to {output_file} ---")
