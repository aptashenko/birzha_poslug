import { mainMenu, subMenu } from "../configs/common.js";

class Categories {
    static async getCategory(categoriesArray) {
        const [idx1, idx2, idx3, idx4] = categoriesArray;
        return {
            parent: mainMenu[idx1][idx2],
            child: subMenu[idx1][idx2][idx3][idx4]
        }
    }

    static async getIndicesByText(text) {
        for (let i = 0; i < mainMenu.length; i++) {
            for (let j = 0; j < mainMenu[i].length; j++) {
                if (mainMenu[i][j] === text) {
                    return [i, j];
                }
            }
        }

        for (let i = 0; i < subMenu.length; i++) {
            for (let j = 0; j < subMenu[i].length; j++) {
                for (let k = 0; k < subMenu[i][j].length; k++) {
                    for (let l = 0; l < subMenu[i][j][k].length; l++) {
                        if (subMenu[i][j][k][l] === text) {
                            return [i, j, k, l];
                        }
                    }
                }
            }
        }

        return null; // Если текст не найден
    }
}

export { Categories };
