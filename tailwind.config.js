/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors:{
      textBlue: "#627EEA",
      background: "#040406",
      bgNav: "#0B0819",
      innerBg:"#1C1731",
      white:"#ffffff",
      lightPurple:"#6E56F8",
      textPurple:"#627EEA",
      borderPurple:"rgba(110, 86, 248, 0.25);",
      themePurple:"#181627"
    },
      backgroundImage: {
        buttonGradient: `linear-gradient(94deg, #1387D5 -5.94%, #1A91FA 115.34%)`,
        redStrain:`linear-gradient(to right, #870000, #190a05);`,
        candy:`linear-gradient(to right, #d3959b, #bfe6ba);`,
        winter:`linear-gradient(to right, #e6dada, #274046);`,
        foreverLost:`linear-gradient(to right, #5d4157, #a8caba);`,
        mistyMeadow:`linear-gradient(to right, #215f00, #e4e4d9);`,
        kyoto: `linear-gradient(to right, #c21500, #ffc500)`,
        blueSkies: `linear-gradient(to right, #56ccf2, #2f80ed); `,
        pinkFlavor: `linear-gradient(to right, #800080, #ffc0cb);`,
        velvetSun: `linear-gradient(to right, #e1eec3, #f05053);`,
        subu: `linear-gradient(to right, #0cebeb, #20e3b2, #29ffc6);`,
        mello: `linear-gradient(to right, #c0392b, #8e44ad);`,
        coolSky: `linear-gradient(to right, #2980b9, #6dd5fa, #ffffff);`,
        megatron: `linear-gradient(to right, #c6ffdd, #fbd786, #f7797d);`,
        harvey: `linear-gradient(to right, #1f4037, #99f2c8);`,
        summerDog: `linear-gradient(to right, #a8ff78, #78ffd6);`,
        margo: `linear-gradient(to right, #ffefba, #ffffff);`,
      },
      fontFamily: {
        'poppins': ['Poppins'],
        'outfit':['Outfit'],
        'kenia':['KENIA'],
        'comfort':['Comfortaa'],
        'caps':['SixCaps'],
        
      }
      
    },
  },
  plugins: [],
}

