module.exports = function (owner) {
    if ((fn = true)) {
        owner.wait = function (resolve, reject) {
            return new Promise((resolve, reject) => {});
        };

        owner.sleep = function (millis) {
            return new Promise((resolve) => setTimeout(resolve, millis));
        };

        owner.randomNumber = function (min = 1, max = 1000) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1) + min);
        };
    }
    if ((like = true)) {
        function escape(s) {
            if (!s) {
                return '';
            }
            if (typeof s !== 'string') {
                s = s.toString();
            }
            return s.replace(/[\/\\^$*+?.()\[\]{}]/g, '\\$&');
        }

        if (!String.prototype.test) {
            String.prototype.test = function (reg, flag = 'gium') {
                try {
                    return new RegExp(reg, flag).test(this);
                } catch (error) {
                    return false;
                }
            };
        }

        if (!String.prototype.like) {
            String.prototype.like = function (name) {
                if (!name) {
                    return false;
                }
                let r = false;
                name.split('|').forEach((n) => {
                    n = n.split('*');
                    n.forEach((w, i) => {
                        n[i] = escape(w);
                    });
                    n = n.join('.*');
                    if (this.test('^' + n + '$', 'gium')) {
                        r = true;
                    }
                });
                return r;
            };
        }

        if (!String.prototype.contains) {
            String.prototype.contains = function (name) {
                let r = false;
                if (!name) {
                    return r;
                }
                name.split('|').forEach((n) => {
                    if (n && this.test('^.*' + escape(n) + '.*$', 'gium')) {
                        r = true;
                    }
                });
                return r;
            };
        }
    }

    if ((vpc = true)) {
        owner.effectiveTypeList = ['slow-2g', '2g', '3g', '4g', '5g'];
        owner.timeZones = [
            {
                value: 'Dateline Standard Time',
                offset: -12,
                text: '(UTC-12:00) International Date Line West',
            },
            {
                value: 'UTC-11',
                offset: -11,
                text: '(UTC-11:00) Coordinated Universal Time-11',
            },
            {
                value: 'Hawaiian Standard Time',
                offset: -10,
                text: '(UTC-10:00) Hawaii',
            },
            {
                value: 'Alaskan Standard Time',
                offset: -9,
                text: '(UTC-09:00) Alaska',
            },
            {
                value: 'Pacific Standard Time (Mexico)',
                offset: -8,
                text: '(UTC-08:00) Baja California',
            },
            {
                value: 'Pacific Daylight Time',
                offset: -7,
                text: '(UTC-07:00) Pacific Daylight Time (US & Canada)',
            },
            {
                value: 'Central Standard Time',
                offset: -6,
                text: '(UTC-06:00) Central Time (US & Canada)',
            },

            {
                value: 'SA Pacific Standard Time',
                offset: -5,
                text: '(UTC-05:00) Bogota, Lima, Quito',
            },
            {
                value: 'Paraguay Standard Time',
                offset: -4,
                text: '(UTC-04:00) Asuncion',
            },
            {
                value: 'E. South America Standard Time',
                offset: -3,
                text: '(UTC-03:00) Brasilia',
            },

            {
                value: 'UTC-02',
                offset: -2,
                text: '(UTC-02:00) Coordinated Universal Time-02',
            },
            {
                value: 'Mid-Atlantic Standard Time',
                offset: -1,
                text: '(UTC-02:00) Mid-Atlantic - Old',
            },
            {
                value: 'GMT Standard Time',
                offset: 0,
                text: '(UTC) Edinburgh, London',
            },

            {
                value: 'British Summer Time',
                offset: 1,
                text: '(UTC+01:00) Edinburgh, London',
            },
            {
                value: 'Central European Standard Time',
                offset: 2,
                text: '(UTC+02:00) Sarajevo, Skopje, Warsaw, Zagreb',
            },
            {
                value: 'GTB Standard Time',
                offset: 3,
                text: '(UTC+02:00) Athens, Bucharest',
            },

            {
                value: 'Samara Time',
                offset: 4,
                text: '(UTC+04:00) Samara, Ulyanovsk, Saratov',
            },

            {
                value: 'Azerbaijan Standard Time',
                offset: 5,
                text: '(UTC+05:00) Baku',
            },

            {
                value: 'Central Asia Standard Time',
                offset: 6,
                text: '(UTC+06:00) Nur-Sultan (Astana)',
            },

            {
                value: 'SE Asia Standard Time',
                offset: 7,
                text: '(UTC+07:00) Bangkok, Hanoi, Jakarta',
            },

            {
                value: 'China Standard Time',
                offset: 8,
                text: '(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi',
            },

            {
                value: 'Japan Standard Time',
                offset: 9,
                text: '(UTC+09:00) Osaka, Sapporo, Tokyo',
            },

            {
                value: 'E. Australia Standard Time',
                offset: 10,
                text: '(UTC+10:00) Brisbane',
            },

            {
                value: 'Central Pacific Standard Time',
                offset: 11,
                text: '(UTC+11:00) Solomon Is., New Caledonia',
            },

            {
                value: 'New Zealand Standard Time',
                offset: 12,
                text: '(UTC+12:00) Auckland, Wellington',
            },
        ];
        owner.languageList = [
            'af',
            'af-NA',
            'af-ZA',
            'agq',
            'agq-CM',
            'ak',
            'ak-GH',
            'am',
            'am-ET',
            'ar',
            'ar-001',
            'ar-AE',
            'ar-BH',
            'ar-DJ',
            'ar-DZ',
            'ar-EG',
            'ar-EH',
            'ar-ER',
            'ar-IL',
            'ar-IQ',
            'ar-JO',
            'ar-KM',
            'ar-KW',
            'ar-LB',
            'ar-LY',
            'ar-MA',
            'ar-MR',
            'ar-OM',
            'ar-PS',
            'ar-QA',
            'ar-SA',
            'ar-SD',
            'ar-SO',
            'ar-SS',
            'ar-SY',
            'ar-TD',
            'ar-TN',
            'ar-YE',
            'as',
            'as-IN',
            'asa',
            'asa-TZ',
            'ast',
            'ast-ES',
            'az',
            'az-Cyrl',
            'az-Cyrl-AZ',
            'az-Latn',
            'az-Latn-AZ',
            'bas',
            'bas-CM',
            'be',
            'be-BY',
            'bem',
            'bem-ZM',
            'bez',
            'bez-TZ',
            'bg',
            'bg-BG',
            'bm',
            'bm-ML',
            'bn',
            'bn-BD',
            'bn-IN',
            'bo',
            'bo-CN',
            'bo-IN',
            'br',
            'br-FR',
            'brx',
            'brx-IN',
            'bs',
            'bs-Cyrl',
            'bs-Cyrl-BA',
            'bs-Latn',
            'bs-Latn-BA',
            'ca',
            'ca-AD',
            'ca-ES',
            'ca-FR',
            'ca-IT',
            'ccp',
            'ccp-BD',
            'ccp-IN',
            'ce',
            'ce-RU',
            'cgg',
            'cgg-UG',
            'chr',
            'chr-US',
            'ckb',
            'ckb-IQ',
            'ckb-IR',
            'cs',
            'cs-CZ',
            'cy',
            'cy-GB',
            'da',
            'da-DK',
            'da-GL',
            'dav',
            'dav-KE',
            'de',
            'de-AT',
            'de-BE',
            'de-CH',
            'de-DE',
            'de-IT',
            'de-LI',
            'de-LU',
            'dje',
            'dje-NE',
            'dsb',
            'dsb-DE',
            'dua',
            'dua-CM',
            'dyo',
            'dyo-SN',
            'dz',
            'dz-BT',
            'ebu',
            'ebu-KE',
            'ee',
            'ee-GH',
            'ee-TG',
            'el',
            'el-CY',
            'el-GR',
            'en',
            'en-001',
            'en-150',
            'en-AG',
            'en-AI',
            'en-AS',
            'en-AT',
            'en-AU',
            'en-BB',
            'en-BE',
            'en-BI',
            'en-BM',
            'en-BS',
            'en-BW',
            'en-BZ',
            'en-CA',
            'en-CC',
            'en-CH',
            'en-CK',
            'en-CM',
            'en-CX',
            'en-CY',
            'en-DE',
            'en-DG',
            'en-DK',
            'en-DM',
            'en-ER',
            'en-FI',
            'en-FJ',
            'en-FK',
            'en-FM',
            'en-GB',
            'en-GD',
            'en-GG',
            'en-GH',
            'en-GI',
            'en-GM',
            'en-GU',
            'en-GY',
            'en-HK',
            'en-IE',
            'en-IL',
            'en-IM',
            'en-IN',
            'en-IO',
            'en-JE',
            'en-JM',
            'en-KE',
            'en-KI',
            'en-KN',
            'en-KY',
            'en-LC',
            'en-LR',
            'en-LS',
            'en-MG',
            'en-MH',
            'en-MO',
            'en-MP',
            'en-MS',
            'en-MT',
            'en-MU',
            'en-MW',
            'en-MY',
            'en-NA',
            'en-NF',
            'en-NG',
            'en-NL',
            'en-NR',
            'en-NU',
            'en-NZ',
            'en-PG',
            'en-PH',
            'en-PK',
            'en-PN',
            'en-PR',
            'en-PW',
            'en-RW',
            'en-SB',
            'en-SC',
            'en-SD',
            'en-SE',
            'en-SG',
            'en-SH',
            'en-SI',
            'en-SL',
            'en-SS',
            'en-SX',
            'en-SZ',
            'en-TC',
            'en-TK',
            'en-TO',
            'en-TT',
            'en-TV',
            'en-TZ',
            'en-UG',
            'en-UM',
            'en-US',
            'en-US-POSIX',
            'en-VC',
            'en-VG',
            'en-VI',
            'en-VU',
            'en-WS',
            'en-ZA',
            'en-ZM',
            'en-ZW',
            'eo',
            'es',
            'es-419',
            'es-AR',
            'es-BO',
            'es-BR',
            'es-BZ',
            'es-CL',
            'es-CO',
            'es-CR',
            'es-CU',
            'es-DO',
            'es-EA',
            'es-EC',
            'es-ES',
            'es-GQ',
            'es-GT',
            'es-HN',
            'es-IC',
            'es-MX',
            'es-NI',
            'es-PA',
            'es-PE',
            'es-PH',
            'es-PR',
            'es-PY',
            'es-SV',
            'es-US',
            'es-UY',
            'es-VE',
            'et',
            'et-EE',
            'eu',
            'eu-ES',
            'ewo',
            'ewo-CM',
            'fa',
            'fa-AF',
            'fa-IR',
            'ff',
            'ff-CM',
            'ff-GN',
            'ff-MR',
            'ff-SN',
            'fi',
            'fi-FI',
            'fil',
            'fil-PH',
            'fo',
            'fo-DK',
            'fo-FO',
            'fr',
            'fr-BE',
            'fr-BF',
            'fr-BI',
            'fr-BJ',
            'fr-BL',
            'fr-CA',
            'fr-CD',
            'fr-CF',
            'fr-CG',
            'fr-CH',
            'fr-CI',
            'fr-CM',
            'fr-DJ',
            'fr-DZ',
            'fr-FR',
            'fr-GA',
            'fr-GF',
            'fr-GN',
            'fr-GP',
            'fr-GQ',
            'fr-HT',
            'fr-KM',
            'fr-LU',
            'fr-MA',
            'fr-MC',
            'fr-MF',
            'fr-MG',
            'fr-ML',
            'fr-MQ',
            'fr-MR',
            'fr-MU',
            'fr-NC',
            'fr-NE',
            'fr-PF',
            'fr-PM',
            'fr-RE',
            'fr-RW',
            'fr-SC',
            'fr-SN',
            'fr-SY',
            'fr-TD',
            'fr-TG',
            'fr-TN',
            'fr-VU',
            'fr-WF',
            'fr-YT',
            'fur',
            'fur-IT',
            'fy',
            'fy-NL',
            'ga',
            'ga-IE',
            'gd',
            'gd-GB',
            'gl',
            'gl-ES',
            'gsw',
            'gsw-CH',
            'gsw-FR',
            'gsw-LI',
            'gu',
            'gu-IN',
            'guz',
            'guz-KE',
            'gv',
            'gv-IM',
            'ha',
            'ha-GH',
            'ha-NE',
            'ha-NG',
            'haw',
            'haw-US',
            'he',
            'he-IL',
            'hi',
            'hi-IN',
            'hr',
            'hr-BA',
            'hr-HR',
            'hsb',
            'hsb-DE',
            'hu',
            'hu-HU',
            'hy',
            'hy-AM',
            'id',
            'id-ID',
            'ig',
            'ig-NG',
            'ii',
            'ii-CN',
            'is',
            'is-IS',
            'it',
            'it-CH',
            'it-IT',
            'it-SM',
            'it-VA',
            'ja',
            'ja-JP',
            'jgo',
            'jgo-CM',
            'jmc',
            'jmc-TZ',
            'ka',
            'ka-GE',
            'kab',
            'kab-DZ',
            'kam',
            'kam-KE',
            'kde',
            'kde-TZ',
            'kea',
            'kea-CV',
            'khq',
            'khq-ML',
            'ki',
            'ki-KE',
            'kk',
            'kk-KZ',
            'kkj',
            'kkj-CM',
            'kl',
            'kl-GL',
            'kln',
            'kln-KE',
            'km',
            'km-KH',
            'kn',
            'kn-IN',
            'ko',
            'ko-KP',
            'ko-KR',
            'kok',
            'kok-IN',
            'ks',
            'ks-IN',
            'ksb',
            'ksb-TZ',
            'ksf',
            'ksf-CM',
            'ksh',
            'ksh-DE',
            'kw',
            'kw-GB',
            'ky',
            'ky-KG',
            'lag',
            'lag-TZ',
            'lb',
            'lb-LU',
            'lg',
            'lg-UG',
            'lkt',
            'lkt-US',
            'ln',
            'ln-AO',
            'ln-CD',
            'ln-CF',
            'ln-CG',
            'lo',
            'lo-LA',
            'lrc',
            'lrc-IQ',
            'lrc-IR',
            'lt',
            'lt-LT',
            'lu',
            'lu-CD',
            'luo',
            'luo-KE',
            'luy',
            'luy-KE',
            'lv',
            'lv-LV',
            'mas',
            'mas-KE',
            'mas-TZ',
            'mer',
            'mer-KE',
            'mfe',
            'mfe-MU',
            'mg',
            'mg-MG',
            'mgh',
            'mgh-MZ',
            'mgo',
            'mgo-CM',
            'mk',
            'mk-MK',
            'ml',
            'ml-IN',
            'mn',
            'mn-MN',
            'mr',
            'mr-IN',
            'ms',
            'ms-BN',
            'ms-MY',
            'ms-SG',
            'mt',
            'mt-MT',
            'mua',
            'mua-CM',
            'my',
            'my-MM',
            'mzn',
            'mzn-IR',
            'naq',
            'naq-NA',
            'nb',
            'nb-NO',
            'nb-SJ',
            'nd',
            'nd-ZW',
            'nds',
            'nds-DE',
            'nds-NL',
            'ne',
            'ne-IN',
            'ne-NP',
            'nl',
            'nl-AW',
            'nl-BE',
            'nl-BQ',
            'nl-CW',
            'nl-NL',
            'nl-SR',
            'nl-SX',
            'nmg',
            'nmg-CM',
            'nn',
            'nn-NO',
            'nnh',
            'nnh-CM',
            'nus',
            'nus-SS',
            'nyn',
            'nyn-UG',
            'om',
            'om-ET',
            'om-KE',
            'or',
            'or-IN',
            'os',
            'os-GE',
            'os-RU',
            'pa',
            'pa-Arab',
            'pa-Arab-PK',
            'pa-Guru',
            'pa-Guru-IN',
            'pl',
            'pl-PL',
            'ps',
            'ps-AF',
            'pt',
            'pt-AO',
            'pt-BR',
            'pt-CH',
            'pt-CV',
            'pt-GQ',
            'pt-GW',
            'pt-LU',
            'pt-MO',
            'pt-MZ',
            'pt-PT',
            'pt-ST',
            'pt-TL',
            'qu',
            'qu-BO',
            'qu-EC',
            'qu-PE',
            'rm',
            'rm-CH',
            'rn',
            'rn-BI',
            'ro',
            'ro-MD',
            'ro-RO',
            'rof',
            'rof-TZ',
            'ru',
            'ru-BY',
            'ru-KG',
            'ru-KZ',
            'ru-MD',
            'ru-RU',
            'ru-UA',
            'rw',
            'rw-RW',
            'rwk',
            'rwk-TZ',
            'sah',
            'sah-RU',
            'saq',
            'saq-KE',
            'sbp',
            'sbp-TZ',
            'se',
            'se-FI',
            'se-NO',
            'se-SE',
            'seh',
            'seh-MZ',
            'ses',
            'ses-ML',
            'sg',
            'sg-CF',
            'shi',
            'shi-Latn',
            'shi-Latn-MA',
            'shi-Tfng',
            'shi-Tfng-MA',
            'si',
            'si-LK',
            'sk',
            'sk-SK',
            'sl',
            'sl-SI',
            'smn',
            'smn-FI',
            'sn',
            'sn-ZW',
            'so',
            'so-DJ',
            'so-ET',
            'so-KE',
            'so-SO',
            'sq',
            'sq-AL',
            'sq-MK',
            'sq-XK',
            'sr',
            'sr-Cyrl',
            'sr-Cyrl-BA',
            'sr-Cyrl-ME',
            'sr-Cyrl-RS',
            'sr-Cyrl-XK',
            'sr-Latn',
            'sr-Latn-BA',
            'sr-Latn-ME',
            'sr-Latn-RS',
            'sr-Latn-XK',
            'sv',
            'sv-AX',
            'sv-FI',
            'sv-SE',
            'sw',
            'sw-CD',
            'sw-KE',
            'sw-TZ',
            'sw-UG',
            'ta',
            'ta-IN',
            'ta-LK',
            'ta-MY',
            'ta-SG',
            'te',
            'te-IN',
            'teo',
            'teo-KE',
            'teo-UG',
            'tg',
            'tg-TJ',
            'th',
            'th-TH',
            'ti',
            'ti-ER',
            'ti-ET',
            'to',
            'to-TO',
            'tr',
            'tr-CY',
            'tr-TR',
            'tt',
            'tt-RU',
            'twq',
            'twq-NE',
            'tzm',
            'tzm-MA',
            'ug',
            'ug-CN',
            'uk',
            'uk-UA',
            'ur',
            'ur-IN',
            'ur-PK',
            'uz',
            'uz-Arab',
            'uz-Arab-AF',
            'uz-Cyrl',
            'uz-Cyrl-UZ',
            'uz-Latn',
            'uz-Latn-UZ',
            'vai',
            'vai-Latn',
            'vai-Latn-LR',
            'vai-Vaii',
            'vai-Vaii-LR',
            'vi',
            'vi-VN',
            'vun',
            'vun-TZ',
            'wae',
            'wae-CH',
            'wo',
            'wo-SN',
            'xog',
            'xog-UG',
            'yav',
            'yav-CM',
            'yi',
            'yi-001',
            'yo',
            'yo-BJ',
            'yo-NG',
            'yue',
            'yue-Hans',
            'yue-Hans-CN',
            'yue-Hant',
            'yue-Hant-HK',
            'zgh',
            'zgh-MA',
            'zh',
            'zh-Hans',
            'zh-Hans-CN',
            'zh-Hans-HK',
            'zh-Hans-MO',
            'zh-Hans-SG',
            'zh-Hant',
            'zh-Hant-HK',
            'zh-Hant-MO',
            'zh-Hant-TW',
            'zu',
            'zu-ZA',
        ];
        owner.connectionTypeList = [
            { name: 'wifi', value: 'wifi' },
            { name: 'wifi', value: 'wifi' },
            { name: 'ethernet', value: 'ethernet' },
            { name: 'mixed', value: 'mixed' },
            { name: 'bluetooth', value: 'bluetooth' },
            { name: 'other', value: 'other' },
            { name: 'unknown', value: 'unknown' },
            { name: 'wimax', value: 'wimax' },
            { name: 'cellular', value: 'cellular' },
        ];
        owner.userAgentDeviceList = [
            {
                name: 'PC',
                platformList: [
                    { name: 'Windows NT 6.1; WOW64', code: 'Win32' },
                    { name: 'Windows NT 10.0; Win64; x64', code: 'Win32' },
                    { name: 'Windows NT 11.0; Win64; x64', code: 'Win32' },
                    { name: 'Windows NT 10.0', code: 'Win32' },
                    { name: 'Windows NT 11.0', code: 'Win32' },
                    { name: 'MacIntel', code: 'MacIntel' },
                    { name: 'Macintosh; Intel Mac OS X 13_0', code: 'MacIntel' },
                    { name: 'Macintosh; Intel Mac OS X 14_0', code: 'MacIntel' },
                    { name: 'Macintosh; Intel Mac OS X 15_0', code: 'MacIntel' },
                    { name: 'Macintosh; Intel Mac OS X 16_0', code: 'MacIntel' },
                    { name: 'Linux x86_64', code: 'Linux x86_64' },
                    { name: 'X11; Ubuntu; Linux x86_64', code: 'Linux x86_64' },
                ],
                screenList: ['2560*1440', '1920*1080', '1792*1120', '1680*1050', '1600*900', '1536*864', '1440*900', '1366*768', '1280*800', '1280*720', '1024*768', '1024*600'],
            },
            {
                name: 'Mobile',
                platformList: [
                    { name: 'Linux; Android 11', code: 'Android' },
                    { name: 'Linux; Android 12', code: 'Android' },
                    { name: 'Linux; Android 13', code: 'Android' },
                    { name: 'Linux; Android 14', code: 'Android' },
                    { name: 'Linux; Android 15', code: 'Android' },
                    { name: 'iPhone; CPU iPhone OS 13_0 like Mac OS X', code: 'iPhone' },
                    { name: 'iPhone; CPU iPhone OS 14_0  like Mac OS X', code: 'iPhone' },
                    { name: 'iPhone; CPU iPhone OS 15_0  like Mac OS X', code: 'iPhone' },
                    { name: 'iPhone; CPU iPhone OS 16_0  like Mac OS X', code: 'iPhone' },
                    { name: 'iPad; CPU OS 13_0  like Mac OS X', code: 'iPad' },
                    { name: 'iPad; CPU OS 14_0  like Mac OS X', code: 'iPad' },
                    { name: 'iPad; CPU OS 15_0  like Mac OS X', code: 'iPad' },
                    { name: 'iPad; CPU OS 16_0  like Mac OS X', code: 'iPad' },
                ],
                screenList: ['601*962', '600*1024', '414*896', '390*844', '360*800', '360*640'],
            },
        ];

        owner.userAgentBrowserList = [
            {
                name: 'Chrome',
                vendor: 'Google Inc.',
                prefix: '',
                randomMajor: () => owner.randomNumber(134, 139),
                randomMinor: () => owner.randomNumber(0, 5735),
                randomPatch: () => owner.randomNumber(0, 199),
            },
            {
                name: 'Edge',
                vendor: '',
                prefix: '',
                randomMajor: () => owner.randomNumber(134, 139),
                randomMinor: () => owner.randomNumber(0, 5735),
                randomPatch: () => owner.randomNumber(0, 199),
            },
            {
                name: 'Firefox',
                vendor: 'Mozilla',
                prefix: '',
                randomMajor: () => owner.randomNumber(134, 139),
                randomMinor: () => owner.randomNumber(0, 9),
                randomPatch: () => owner.randomNumber(0, 99),
            },
            {
                name: 'Safari',
                vendor: 'Apple Computer, Inc.',
                prefix: '',
                randomMajor: () => owner.randomNumber(600, 605),
                randomMinor: () => owner.randomNumber(1, 15),
                randomPatch: () => owner.randomNumber(10, 14),
            },
            {
                name: 'Opera',
                vendor: '',
                prefix: '',
                randomMajor: () => owner.randomNumber(134, 139),
                randomMinor: () => owner.randomNumber(0, 5735),
                randomPatch: () => owner.randomNumber(0, 199),
            },
        ];

        owner.getRandomBrowser = function (deviceName = '*', browserName = '*', platformName = '*') {
            let browser = owner.userAgentBrowserList.filter((d) => d.name.contains(browserName));
            browser = browser[owner.randomNumber(0, browser.length - 1)] || owner.userAgentBrowserList[owner.randomNumber(0, owner.userAgentBrowserList.length - 1)];
            browser = { ...browser };

            let devices = owner.userAgentDeviceList.filter((d) => d.name.contains(deviceName));
            browser.device = devices[owner.randomNumber(0, devices.length - 1)] || owner.userAgentDeviceList[owner.randomNumber(0, owner.userAgentDeviceList.length - 1)];

            browser.screen = browser.device.screenList[owner.randomNumber(0, browser.device.screenList.length - 1)];
            browser.screen = browser.screen.split('*');
            browser.screen = { width: parseInt(browser.screen[0]), height: parseInt(browser.screen[1]) };

            browser.platformInfo = browser.device.platformList.filter((d) => d.name.contains(platformName));
            browser.platformInfo =
                browser.platformInfo[owner.randomNumber(0, browser.platformInfo.length - 1)] || browser.device.platformList[owner.randomNumber(0, browser.device.platformList.length - 1)];
            browser.platform = browser.platformInfo.code;
            if (browser.device.name === 'Mobile') {
                browser.prefix = 'Mobile';
            }

            browser.major = browser.randomMajor();
            browser.minor = browser.randomMinor();
            browser.patch = browser.randomPatch();

            browser.randomMajor = undefined;
            browser.randomMinor = undefined;
            browser.randomPatch = undefined;

            delete browser.randomMajor;
            delete browser.randomMinor;
            delete browser.randomPatch;

            if (browser.name.contains('Safari')) {
                browser.url = `Mozilla/5.0 (${browser.platformInfo.name}) AppleWebKit/${browser.major}.${browser.minor} (KHTML, like Gecko) Version/${browser.patch}.0 Safari/${browser.major}.${browser.minor}`;
            }
            if (browser.name.contains('Firefox')) {
                browser.url = `Mozilla/5.0 (${browser.platformInfo.name}; rv:${browser.major}.${browser.minor}) Gecko/20100101 Firefox/${browser.major}.${browser.minor}`;
            } else {
                browser.url = `Mozilla/5.0 (${browser.platformInfo.name}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browser.major}.${browser.minor}.${browser.patch} ${browser.prefix} Safari/537.36`;
            }

            if (browser.name.contains('Edge')) {
                browser.url += ` ${browser.name}/${browser.major}.${browser.minor}.${browser.patch}`;
            }
            return browser;
        };

        owner.getRandomUserAgent = function () {
            return owner.getRandomBrowser().url;
        };

        owner.generateVPC = function () {
            let browser = owner.getRandomBrowser();
            return {
                hide_memory: true,
                memory_count: owner.randomNumber(1, 128),
                hide_cpu: true,
                cpu_count: owner.randomNumber(1, 64),
                hide_lang: true,
                hide_location: true,
                location: {
                    latitude: owner.randomNumber(1, 49) + Math.random(),
                    longitude: owner.randomNumber(1, 49) + Math.random(),
                },
                languages:
                    owner.languageList[owner.randomNumber(0, owner.languageList.length - 1)] +
                    ',' +
                    owner.languageList[owner.randomNumber(0, owner.languageList.length - 1)] +
                    ';q=0.9,' +
                    owner.languageList[owner.randomNumber(0, owner.languageList.length - 1)] +
                    ';q=0.8',
                mask_date: false,
                timeZone: owner.timeZones[owner.randomNumber(0, owner.timeZones.length - 1)],
                hide_webgl: true,
                hide_mimetypes: true,
                hide_plugins: true,
                hide_screen: true,
                screen: {
                    width: browser.screen.width,
                    height: browser.screen.height,
                    availWidth: browser.screen.width,
                    availHeight: browser.screen.height,
                },
                set_window_active: true,
                set_tab_active: false,
                block_rtc: true,
                hide_battery: true,
                hide_canvas: true,
                hide_audio: true,
                hide_media_devices: true,
                hide_connection: true,
                connection: {
                    downlink: owner.randomNumber(1, 15) / 10,
                    downlinkMax: owner.randomNumber(15, 30) / 10,
                    effectiveType: owner.effectiveTypeList[owner.randomNumber(0, owner.effectiveTypeList.length - 1)],
                    rtt: owner.randomNumber(300, 900),
                    type: owner.connectionTypeList[owner.randomNumber(0, owner.connectionTypeList.length - 1)].name,
                },
                dnt: true,
                maskUserAgentURL: false,
                hide_fonts: false,
            };
        };
    }

    if ((encode = true)) {
        owner.encodeURI = (value) => {
            try {
                return encodeURI(value);
            } catch (error) {
                return value;
            }
        };
        owner.decodeURI = (value) => {
            try {
                return decodeURI(value);
            } catch (error) {
                return value;
            }
        };

        owner.decodeURIComponent = (value) => {
            try {
                return decodeURIComponent(value);
            } catch (error) {
                return value;
            }
        };
        owner.encodeURIComponent = (value) => {
            try {
                return encodeURIComponent(value);
            } catch (error) {
                return value;
            }
        };
    }
};
