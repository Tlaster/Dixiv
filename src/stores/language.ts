import {types} from 'mobx-state-tree';
import {addLocaleData} from "react-intl";
import * as en from 'react-intl/locale-data/en';
import * as zh from 'react-intl/locale-data/zh';
import ZH from '../i18n/zh.json'
import EN from '../i18n/en.json';

addLocaleData([...en, ...zh]);

function getLocalMessage(language: string) {
    let messages;
    if (language.startsWith('zh')) {
        messages = ZH;
    } else if (language.startsWith('en')) {
        messages = EN;
    }
    return messages;
}

function getLocal(language: string) {
    let locale;
    if (language.startsWith('zh')) {
        locale = 'zh';
    } else if (language.startsWith('en')) {
        locale = 'en';
    }
    return locale;

}

const Language = types.model({
    name: types.string,
}).views(self => ({
    get local() {
        return getLocal(self.name);
    },

    get message() {
        return getLocalMessage(self.name);
    }
}));

const DEFAULT = {
    name: window.navigator.language,
};

export { Language as Model, DEFAULT }