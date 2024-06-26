import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  Text
} from "react-native";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import SocialSignInButtons from "../components/SocialSignInButtons";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { useSignInEmailPassword } from "@nhost/react";


import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

function SignInScreen(){
  
  const navigation = useNavigation();

  const { control, handleSubmit } = useForm();

  const { signInEmailPassword, isLoading } = useSignInEmailPassword();

  const onSignInPressed = async (data: { email: any; password: any; }) => {
    if (isLoading) {
      return;
    }
    const {email, password} = data;
    const {error, needsEmailVerification} = await signInEmailPassword(email, password);

    if(error){
      Alert.alert('Error', error.message);
    }

    if(needsEmailVerification){
      Alert.alert("Verify Your Email", "Check your email for a verification link");
    }

  };

  const onForgotPasswordPressed = () => {
    // navigation.navigate("ForgotPassword");
  };

  const onSignUpPress = () => {
    navigation.navigate("SignUp");
  };

  const Onboarding = () => {
    navigation.navigate("Onboarding");
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.root}>
      <Image source={require('../../../assets/images/logo.png')} style={styles.logo} resizeMode="cover" />
      <View style={styles.container}>
        <CustomInput
          name="email"
          placeholder="Email"
          control={control}
          rules={{
            required: "Email is required",
            pattern: { value: EMAIL_REGEX, message: "Email is invalid" },
          }}
        />

        <CustomInput
          name="password"
          placeholder="Password"
          secureTextEntry
          control={control}
          rules={{
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password should be minimum 8 characters long",
            },
          }}
        />

        <CustomButton
          text={isLoading ? "Loading..." : "Sign In"}
          onPress={handleSubmit(onSignInPressed)}
        />

        <CustomButton
          text="Forgot password?"
          onPress={onForgotPasswordPressed}
          type="TERTIARY"
        />

        <SocialSignInButtons />

        <CustomButton
          text="Don't have an account? Create one"
          onPress={onSignUpPress}
          type="TERTIARY"
        />
        <CustomButton
          text="First time? Click Here"
          onPress={Onboarding}
          type="TERTIARY"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: "white",
    minHeight: "100%",
  },
  container: {
    padding: 20,
  },
  logo: {
    width: "100%",
    height: undefined,
    aspectRatio: 16 / 9,
  },
});

export default SignInScreen;
