export enum UserRegionEnum {
  WesternAndNorthernEurope_NorthAmerica = "western_and_northern_europe_north_america",
  Mediterranean_MiddleEast_CentralAsia = "mediterranean_middle_east_central_asia",
  EastAndSoutheastAsia = "east_and_southeast_asia",
  SouthAsia_Africa = "south_asia_africa",
  LatinAmerica_Caribbean = "latin_america_caribbean",
}

export const getRegionLabels = (): Record<UserRegionEnum, string> => {
  return {
    [UserRegionEnum.WesternAndNorthernEurope_NorthAmerica]:
      "🌍 Западная и Северная Европа, Северная Америка (США, Великобритания, Германия, Канада, Норвегия)",
    [UserRegionEnum.Mediterranean_MiddleEast_CentralAsia]:
      "🌞 Средиземноморье, Ближний Восток и Центральная Азия (Италия, Греция, Турция, Израиль, Казахстан)",
    [UserRegionEnum.EastAndSoutheastAsia]:
      "🏯 Восточная и Юго-Восточная Азия (Китай, Япония, Таиланд, Вьетнам, Индонезия)",
    [UserRegionEnum.SouthAsia_Africa]:
      "🌄 Южная Азия и Африка (Индия, Пакистан, Кения, Нигерия, Южно-Африканская Республика)",
    [UserRegionEnum.LatinAmerica_Caribbean]:
      "🌴 Латинская Америка и Карибский бассейн (Мексика, Бразилия, Аргентина, Куба, Чили)",
  };
};
