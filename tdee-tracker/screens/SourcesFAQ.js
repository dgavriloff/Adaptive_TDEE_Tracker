import { View, Text, StyleSheet, Button, Linking } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Segment from "../components/Segment";
import { useContext } from "react";
import { ThemeContext } from "../components/ThemeProvider";

export default SourcesAndFAQ = () => {
  const { currentTheme } = useContext(ThemeContext);

  const styles = StyleSheet.create({
    container: {
      flexDirection: "column",
      alignItems: "center",
    },
    questionSection: {},
    headerText: {
      color: currentTheme.fontColor,
      fontWeight: "800",
      fontSize: 20,
    },
    subText: {
      color: currentTheme.fontColor,
      fontSize: 18,
    },
  });
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      style={{ backgroundColor: currentTheme.backgroundColor }}
    >
      <Segment label={"What is TDEE"}>
        <View style={styles.questionSection}>
          <Text style={styles.subText}>
            Total Daily Energy Expenditure (TDEE) is the total number of
            calories your body burns in a day. {"\n"}
            {"\n"}It includes the energy used for basic bodily functions (Basal
            Metabolic Rate), physical activity, and digestion (thermic effect of
            food). TDEE varies based on factors like age, weight, activity
            level, and metabolism. {"\n"}
            {"\n"}Knowing your TDEE helps you understand how many calories you
            need to maintain, lose, or gain weight.
          </Text>
        </View>
      </Segment>
      <Segment label={"How is my TDEE calculated?"}>
        <View style={styles.questionSection}>
          <Text style={styles.subText}>
            {"\n"}At registration, your TDEE is calulculated using the Mifflin
            St Jeor equation. This is less than ideal because it relies on you
            choosing your activity level correctly, which is hard since we don't
            know how many calories we burn. As you add more data, your Total
            Daily Energy Expenditure (TDEE) is calculated based on your weight
            loss and calorie intake. {"\n"}
            {"\n"}We use the principle of energy balance, where weight change
            reflects the difference between the calories you consume and the
            energy your body burns. By tracking how many calories you're eating
            and how much weight you're losing, we can estimate your TDEE by
            accounting for the calorie deficit that results in your weight loss.
            {"\n"}
            {"\n"}Typically, losing 1 pound per week means you're in a
            500-calorie daily deficit, which helps us calculate your overall
            energy expenditure. {"\n"}
          </Text>
        </View>
      </Segment>
      <Segment label={"How is my goal gate calculated?"}>
        <View style={styles.questionSection}>
          <Text style={styles.subText}>
            Your goal date is calculated based on your current weight, goal
            weight, and daily calorie deficit (or surplus). The function uses
            the following steps: {"\n"}
            {"\n"}
            It first checks if you have a daily calorie deficit. {"\n"}
            {"\n"}If you're maintaining, no date is calulculated.{"\n"}
            {"\n"}The total weight change required to reach your goal is
            determined. {"\n"}
            {"\n"}For weight in pounds, the function estimates how long it will
            take to achieve your goal based on the fact that 1 pound of fat
            equals about 3,500 calories. {"\n"}
            {"\n"}For kilograms, it converts your weight to pounds before
            applying the same calculation. {"\n"}
            {"\n"}Finally, the function adds the calculated number of days to
            the current date to estimate when you'll reach your goal.
          </Text>
        </View>
      </Segment>
      <Segment label={"Sources"}>
        <Text style={styles.subText}>
          Mifflin MD, St Jeor ST, Hill LA, Scott BJ, Daugherty SA, Koh YO.{"\n"}
          <Text
            style={{ ...styles.subText, color: currentTheme.buttonTextColor }}
            onPress={() =>
              Linking.openURL(
                "https://read.qxmd.com/read/2305711/a-new-predictive-equation-for-resting-energy-expenditure-in-healthy-individuals?redirected=slug"
              )
            }
          >
            A new predictive equation for resting energy expenditure in healthy
            individuals.
          </Text>
          {"\n"}Am J Clin Nutr. 1990;51(2):241-7. doi: 10.1093/ajcn/51.2.241.
          {"\n"}
        </Text>
        <Text style={styles.subText}>
          Hall KD, Heymsfield SB, Kemnitz JW, Klein S, Schoeller DA, Speakman
          JR. {"\n"}
          <Text
            style={{ ...styles.subText, color: currentTheme.buttonTextColor }}
            onPress={() =>
              Linking.openURL(
                "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3302369/"
              )
            }
          >
            Energy balance and its components: implications for body weight
            regulation.
          </Text>
          {"\n"}Am J Clin Nutr. 2012 Apr;95(4):989-94. doi:
          10.3945/ajcn.112.036350. Erratum in: Am J Clin Nutr. 2012
          Aug;96(2):448. PMID: 22434603; PMCID: PMC3302369. {"\n"}
        </Text>
        <Text style={styles.subText}>
          Müller MJ, Enderle J, Bosy-Westphal A. {"\n"}
          <Text
            style={{ ...styles.subText, color: currentTheme.buttonTextColor }}
            onPress={() =>
              Linking.openURL(
                "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5097076/"
              )
            }
          >
            Changes in Energy Expenditure with Weight Gain and Weight Loss in
            Humans.
          </Text>
          {"\n"}Curr Obes Rep. 2016 Dec;5(4):413-423. doi:
          10.1007/s13679-016-0237-4. PMID: 27739007; PMCID: PMC5097076.
        </Text>
      </Segment>
    </ScrollView>
  );
};
