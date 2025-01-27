import {mainMenu, subMenu} from "../configs/common.js";

class Categories {
    static async getCategory(categoriesArray) {
        const [idx1, idx2, idx3, idx4] = categoriesArray;
        return {
            parent: mainMenu[idx1][idx2],
            child: subMenu[idx1][idx2][idx3][idx4]
        }
    }
}

export { Categories }
