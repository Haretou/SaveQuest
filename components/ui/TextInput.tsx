import React from "react";
import { TextInput as RNTextInput, TextInputProps } from "react-native";

export function TextInput({ style, ...props }: TextInputProps) {
  return (
    <RNTextInput
      style={[{ fontFamily: "BricolageGrotesque_400Regular" }, style]}
      {...props}
    />
  );
}

export default TextInput;
