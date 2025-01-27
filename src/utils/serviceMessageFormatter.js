import {mainMenu, subMenu} from "../configs/common.js";

export default ({ id = 0, category, description, phone, username, cities }) => {
    const mainCategory = mainMenu[category[0]][category[1]];
    const subCategory = subMenu[category[0]][category[1]][category[2]][category[3]];

    return `
*🆔 ID:* ${id}

*📂 Категорія:*
🔹 *Основна категорія:* ${mainCategory}
🔹 *Підкатегорія:* ${subCategory}

*📝 Опис:*
${description}

*📞 Контакти:*
\\- Телефон [${phone}](tel:${phone}) 
\\- Telegram [@${username}](https://t.me/${username})

*🌍 Територія надання послуг:*
${cities.join(', ')}
`;
};
