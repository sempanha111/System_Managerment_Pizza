import pro_img_1 from "./movie-project.png";
import pro_img_2 from "./Mern-project.png";
import pro_img_3 from "./Porfolio-Project.png";

const data = [
  {
    id: 1,
    name: "HTML",
    level: 90,
  },
  {
    id: 2,
    name: "CSS",
    level: 90,
  },
  {
    id: 3,
    name: "Javascript",
    level: 80,
  },
  {
    id: 4,
    name: "Tailwind",
    level: 90,
  },
  {
    id: 5,
    name: "Bootstrap",
    level: 80,
  },
  {
    id: 6,
    name: "JQuery",
    level: 80,
  },
  {
    id: 7,
    name: "React JS",
    level: 70,
  },
];

export const additionalskill = [
  {
    id: 1,
    skill: "Git",
  },
  {
    id: 2,
    skill: "Photoshop",
  },
  {
    id: 3,
    skill: "Illustrator",
  },
  {
    id: 4,
    skill: "Vercel",
  },
  {
    id: 5,
    skill: "Teamwork",
  },
  {
    id: 6,
    skill: "Good communication",
  },
  {
    id: 7,
    skill: "Quick Learning",
  },
  {
    id: 8,
    skill: "Meduim English",
  },
];

export const project = [
  {
    id: 1,
    name: "Movie-for-kh movie streaming website",
    img: pro_img_1,
    desc: "loremLorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi facilis quasi laboriosam doloribus. Dignissimos.",
    demo_link: "https://samon-movieforkh.vercel.app/",
    githup_link: "https://github.com/samonbk/samon-movieforkh",
    tech: [
      {
        techId : 1,
        name : "reactjs"
      },
      {
        techId: 2,
        name : "tailwind"
      },
      {
        techId : 3,
        name : "nodejs"
      },
    ]
  },
  {
    id: 2,
    name: "Movie-for-kh movie streaming website",
    img: pro_img_2,
    desc: "loremLorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi facilis quasi laboriosam doloribus. Dignissimos.",
    demo_link: "https://samon-mern.vercel.app/",
    githup_link: "https://github.com/samonbk/samon-mern",
    tech: [
      {
        techId : 1,
        name : "reactjs"
      },
      {
        techId: 2,
        name : "tailwind"
      },
      {
        techId : 3,
        name : "nodejs"
      },
      {
        techId : 4,
        name : "mongoDB"
      },
    ]
  },
  {
    id: 3,
    name: "Movie-for-kh movie streaming website",
    img: pro_img_3,
    desc: "loremLorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi facilis quasi laboriosam doloribus. Dignissimos.",
    demo_link: "https://samon-portfolio.vercel.app/",
    githup_link: "https://github.com/samonbk/portfolio",
    tech: [
      {
        techId : 1,
        name : "reactjs"
      },
      {
        techId: 2,
        name : "tailwind"
      }
    ]
  }
];




export default data;
