// =============================================
// EVRENSEL KARAKTER KODLAYICI
// Tüm Unicode karakterleri için sayısal kodlama
// =============================================

(function(Scratch) {
  'use strict';
  
  const extensionId = 'unicodeEncoder';
  const extensionName = 'Evrensel Kodlayıcı';
  
  class UnicodeEncoder {
    constructor() {
      // Sabitler
      this.UNICODE_FLAG = '999';       // Unicode bayrağı
      this.UTF8_FLAG = '888';          // UTF-8 bayrağı
      this.BASE64_FLAG = '777';        // Base64 bayrağı
      this.SEPARATOR = '000';          // Ayraç (karakter sınırı için)
      this.EMPTY_CODE = '0';           // Boş kod
      
      // Unicode blokları için bayraklar
      this.UNICODE_BLOCKS = {
        'BASIC_LATIN': '001',      // U+0000-U+007F
        'LATIN_EXTENDED': '002',   // U+0080-U+00FF
        'LATIN_EXT_A': '003',      // U+0100-U+017F
        'LATIN_EXT_B': '004',      // U+0180-U+024F
        'GREEK': '005',            // U+0370-U+03FF
        'CYRILLIC': '006',         // U+0400-U+04FF
        'ARABIC': '007',           // U+0600-U+06FF
        'HEBREW': '008',           // U+0590-U+05FF
        'DEVANAGARI': '009',       // U+0900-U+097F
        'BENGALI': '010',          // U+0980-U+09FF
        'CHINESE': '011',          // U+4E00-U+9FFF
        'JAPANESE': '012',         // U+3040-U+309F (Hiragana)
        'KOREAN': '013',           // U+AC00-U+D7AF (Hangul)
        'EMOJI': '014',            // U+1F600-U+1F64F
        'SPECIALS': '015'          // Özel karakterler
      };
      
      // Özel karakterler için kısa kodlar
      this.SPECIAL_CHARS = {
        ' ': '032',    // Space
        '!': '033',
        '"': '034',
        '#': '035',
        '$': '036',
        '%': '037',
        '&': '038',
        "'": '039',
        '(': '040',
        ')': '041',
        '*': '042',
        '+': '043',
        ',': '044',
        '-': '045',
        '.': '046',
        '/': '047',
        ':': '058',
        ';': '059',
        '<': '060',
        '=': '061',
        '>': '062',
        '?': '063',
        '@': '064',
        '[': '091',
        '\\': '092',
        ']': '093',
        '^': '094',
        '_': '095',
        '`': '096',
        '{': '123',
        '|': '124',
        '}': '125',
        '~': '126'
      };
      
      this.reverseSpecialChars = {};
      for (const [char, code] of Object.entries(this.SPECIAL_CHARS)) {
        this.reverseSpecialChars[code] = char;
      }
      
      // Popüler diller için kısa kodlar
      this.LANGUAGE_SHORTCUTS = {
        // Türkçe
        'ç': '128', 'Ç': '129',
        'ğ': '130', 'Ğ': '131',
        'ı': '132', 'İ': '133',
        'ö': '134', 'Ö': '135',
        'ş': '136', 'Ş': '137',
        'ü': '138', 'Ü': '139',
        
        // Almanca
        'ä': '140', 'Ä': '141',
        'ö': '142', 'Ö': '143',
        'ü': '144', 'Ü': '145',
        'ß': '146',
        
        // Fransızca
        'à': '147', 'â': '148', 'æ': '149',
        'ç': '150', 'è': '151', 'é': '152',
        'ê': '153', 'ë': '154', 'î': '155',
        'ï': '156', 'ô': '157', 'œ': '158',
        'ù': '159', 'û': '160', 'ü': '161',
        'ÿ': '162',
        
        // İspanyolca
        'á': '163', 'é': '164', 'í': '165',
        'ñ': '166', 'ó': '167', 'ú': '168',
        'ü': '169', '¿': '170', '¡': '171',
        
        // Rusça (Kiril)
        'А': '172', 'Б': '173', 'В': '174',
        'Г': '175', 'Д': '176', 'Е': '177',
        'Ё': '178', 'Ж': '179', 'З': '180',
        'И': '181', 'Й': '182', 'К': '183',
        'Л': '184', 'М': '185', 'Н': '186',
        'О': '187', 'П': '188', 'Р': '189',
        'С': '190', 'Т': '191', 'У': '192',
        'Ф': '193', 'Х': '194', 'Ц': '195',
        'Ч': '196', 'Ш': '197', 'Щ': '198',
        'Ъ': '199', 'Ы': '200', 'Ь': '201',
        'Э': '202', 'Ю': '203', 'Я': '204',
        
        // Arapça
        'ا': '205', 'ب': '206', 'ت': '207',
        'ث': '208', 'ج': '209', 'ح': '210',
        'خ': '211', 'د': '212', 'ذ': '213',
        'ر': '214', 'ز': '215', 'س': '216',
        'ش': '217', 'ص': '218', 'ض': '219',
        'ط': '220', 'ظ': '221', 'ع': '222',
        'غ': '223', 'ف': '224', 'ق': '225',
        'ك': '226', 'ل': '227', 'م': '228',
        'ن': '229', 'ه': '230', 'و': '231',
        'ي': '232',
        
        // Japonca (Hiragana temel)
        'あ': '233', 'い': '234', 'う': '235',
        'え': '236', 'お': '237', 'か': '238',
        'き': '239', 'く': '240', 'け': '241',
        'こ': '242', 'さ': '243', 'し': '244',
        'す': '245', 'せ': '246', 'そ': '247',
        
        // Çince temel (basitleştirilmiş)
        '一': '248', '二': '249', '三': '250',
        '四': '251', '五': '252', '六': '253',
        '七': '254', '八': '255', '九': '256',
        '十': '257', '中': '258', '国': '259',
        '人': '260', '大': '261', '小': '262',
        
        // Hintçe (Devanagari)
        'अ': '263', 'आ': '264', 'इ': '265',
        'ई': '266', 'उ': '267', 'ऊ': '268',
        'ऋ': '269', 'ए': '270', 'ऐ': '271',
        'ओ': '272', 'औ': '273', 'क': '274',
        'ख': '275', 'ग': '276', 'घ': '277',
        
        // Korece (Hangul)
        '가': '278', '나': '279', '다': '280',
        '라': '281', '마': '282', '바': '283',
        '사': '284', '아': '285', '자': '286',
        '차': '287', '카': '288', '타': '289',
        '파': '290', '하': '291',
        
        // Yunan
        'α': '292', 'β': '293', 'γ': '294',
        'δ': '295', 'ε': '296', 'ζ': '297',
        'η': '298', 'θ': '299', 'ι': '300',
        'κ': '301', 'λ': '302', 'μ': '303',
        'ν': '304', 'ξ': '305', 'ο': '306',
        'π': '307', 'ρ': '308', 'σ': '309',
        'τ': '310', 'υ': '311', 'φ': '312',
        'χ': '313', 'ψ': '314', 'ω': '315',
        
        // Emoji (temel)
        '😀': '401', '😂': '402', '😍': '403',
        '😊': '404', '👍': '405', '❤️': '406',
        '🔥': '407', '⭐': '408', '🎮': '409',
        '🚀': '410', '💻': '411', '🎵': '412'
      };
      
      this.reverseLanguageShortcuts = {};
      for (const [char, code] of Object.entries(this.LANGUAGE_SHORTCUTS)) {
        this.reverseLanguageShortcuts[code] = char;
      }
    }
    
    getInfo() {
      return {
        id: extensionId,
        name: extensionName,
        color1: '#9966FF',
        color2: '#7A52CC',
        color3: '#5C3D99',
        blocks: [
          {
            opcode: 'encodeUniversal',
            blockType: Scratch.BlockType.REPORTER,
            text: 'evrensel kodla [TEXT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello 你好 مرحبا'
              }
            }
          },
          {
            opcode: 'decodeUniversal',
            blockType: Scratch.BlockType.REPORTER,
            text: 'evrensel kodu çöz [CODE]',
            arguments: {
              CODE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ''
              }
            }
          },
          {
            opcode: 'encodeToCloud',
            blockType: Scratch.BlockType.COMMAND,
            text: 'buluta kaydet [TEXT] [VAR] değişkenine',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Test 测试 테스트'
              },
              VAR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'cloud_text'
              }
            }
          },
          {
            opcode: 'decodeFromCloud',
            blockType: Scratch.BlockType.REPORTER,
            text: 'buluttan oku [VAR] değişkenini',
            arguments: {
              VAR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'cloud_text'
              }
            }
          },
          '---',
          {
            opcode: 'detectLanguage',
            blockType: Scratch.BlockType.REPORTER,
            text: 'dil tespit et [TEXT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello'
              }
            }
          },
          {
            opcode: 'getCharCode',
            blockType: Scratch.BlockType.REPORTER,
            text: 'karakter kodu [CHAR]',
            arguments: {
              CHAR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'A'
              }
            }
          },
          {
            opcode: 'getCharFromCode',
            blockType: Scratch.BlockType.REPORTER,
            text: 'koddan karakter [CODE]',
            arguments: {
              CODE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 65
              }
            }
          },
          '---',
          {
            opcode: 'encodeCompact',
            blockType: Scratch.BlockType.REPORTER,
            text: 'sıkıştırılmış kodla [TEXT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'ABC'
              }
            }
          },
          {
            opcode: 'encodeBase36',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Base36 kodla [TEXT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello'
              }
            }
          },
          {
            opcode: 'isSupported',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '[TEXT] destekleniyor mu?',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '😀'
              }
            }
          },
          {
            opcode: 'getLength',
            blockType: Scratch.BlockType.REPORTER,
            text: 'kod uzunluğu [TEXT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Test'
              }
            }
          }
        ],
        menus: {}
      };
    }
    
    // =============================================
    // EVRENSEL KODLAMA SİSTEMİ
    // =============================================
    
    // 1. EVRENSEL KODLAMA (Tüm Unicode karakterler)
    encodeUniversal(args) {
      const text = args.TEXT.toString();
      if (!text) return this.EMPTY_CODE;
      
      let result = this.UNICODE_FLAG; // Unicode bayrağı
      
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        
        // Önce kısa kodları dene (performans için)
        if (this.LANGUAGE_SHORTCUTS[char]) {
          result += this.LANGUAGE_SHORTCUTS[char];
          continue;
        }
        
        // Özel karakter kontrolü
        if (this.SPECIAL_CHARS[char]) {
          result += this.SPECIAL_CHARS[char];
          continue;
        }
        
        // Unicode kod noktası (6 haneli)
        const codePoint = char.codePointAt(0);
        result += codePoint.toString().padStart(6, '0');
        
        // Surrogate pair kontrolü (emoji vb.)
        if (codePoint > 0xFFFF) {
          i++; // High surrogate'ı atla
        }
      }
      
      return result;
    }
    
    // 2. EVRENSEL KOD ÇÖZME
    decodeUniversal(args) {
      const code = args.CODE.toString().trim();
      if (!code || code === this.EMPTY_CODE) return '';
      
      // Unicode bayrağını kontrol et
      if (!code.startsWith(this.UNICODE_FLAG)) {
        // Eski format, basit ASCII dene
        return this.decodeLegacy(code);
      }
      
      let result = '';
      let i = this.UNICODE_FLAG.length;
      
      while (i < code.length) {
        // Önce 3 haneli kısa kodları dene
        const threeDigit = code.substr(i, 3);
        
        if (this.reverseLanguageShortcuts[threeDigit]) {
          result += this.reverseLanguageShortcuts[threeDigit];
          i += 3;
          continue;
        }
        
        // Özel karakter kontrolü (3 haneli)
        if (this.reverseSpecialChars[threeDigit]) {
          result += this.reverseSpecialChars[threeDigit];
          i += 3;
          continue;
        }
        
        // 6 haneli Unicode kod noktası
        const sixDigit = code.substr(i, 6);
        const codePoint = parseInt(sixDigit);
        
        if (!isNaN(codePoint) && codePoint > 0) {
          try {
            result += String.fromCodePoint(codePoint);
          } catch (e) {
            // Geçersiz kod noktası
            result += '�';
          }
          i += 6;
        } else {
          // Bilinmeyen format, bir sonrakine geç
          i += 1;
        }
      }
      
      return result;
    }
    
    // 3. BULUTA KAYDET
    encodeToCloud(args) {
      const text = args.TEXT.toString();
      const varName = args.VAR.toString();
      
      if (!text) return this.EMPTY_CODE;
      
      // Optimize edilmiş kodlama (bulut için)
      const encoded = this.encodeOptimized(text);
      
      console.log(`[Evrensel Kodlayıcı] '${text}' -> '${encoded}'`);
      
      // Scratch'e kaydet
      if (typeof Scratch.vm !== 'undefined') {
        try {
          // Bulut değişkenine kaydet
          Scratch.vm.runtime.ioDevices.cloud.createCloudVariable(varName, encoded);
          console.log(`Buluta kaydedildi: ${varName} = ${encoded}`);
        } catch (error) {
          console.error('Bulut kaydetme hatası:', error);
        }
      }
      
      return encoded;
    }
    
    // 4. BULUTTAN OKU
    decodeFromCloud(args) {
      const varName = args.VAR.toString();
      let encoded = this.EMPTY_CODE;
      
      if (typeof Scratch.vm !== 'undefined') {
        try {
          const cloudData = Scratch.vm.runtime.ioDevices.cloud.getCloudVariable(varName);
          if (cloudData) {
            encoded = cloudData.toString();
          }
        } catch (error) {
          console.error('Bulut okuma hatası:', error);
        }
      }
      
      if (!encoded || encoded === this.EMPTY_CODE) {
        return '[Veri Yok]';
      }
      
      return this.decodeUniversal({CODE: encoded});
    }
    
    // =============================================
    // YARDIMCI FONKSİYONLAR
    // =============================================
    
    // 5. DİL TESPİTİ
    detectLanguage(args) {
      const text = args.TEXT.toString();
      if (!text) return 'Bilinmiyor';
      
      const ranges = {
        'Latin': /[\u0000-\u007F\u0080-\u00FF\u0100-\u017F\u0180-\u024F]/,
        'Yunan': /[\u0370-\u03FF]/,
        'Kiril': /[\u0400-\u04FF]/,
        'Arapça': /[\u0600-\u06FF]/,
        'İbranice': /[\u0590-\u05FF]/,
        'Hintçe': /[\u0900-\u097F]/,
        'Çince': /[\u4E00-\u9FFF]/,
        'Japonca': /[\u3040-\u309F\u30A0-\u30FF]/,
        'Korece': /[\uAC00-\uD7AF]/,
        'Emoji': /[\u1F600-\u1F64F]/
      };
      
      let detected = new Set();
      
      for (const [lang, regex] of Object.entries(ranges)) {
        if (regex.test(text)) {
          detected.add(lang);
        }
      }
      
      if (detected.size === 0) return 'Bilinmiyor';
      return Array.from(detected).join(', ');
    }
    
    // 6. KARAKTER KODU AL
    getCharCode(args) {
      const char = args.CHAR.toString();
      if (!char) return 0;
      return char.codePointAt(0);
    }
    
    // 7. KODDAN KARAKTER AL
    getCharFromCode(args) {
      const code = parseInt(args.CODE);
      if (isNaN(code) || code < 0) return '';
      
      try {
        return String.fromCodePoint(code);
      } catch (e) {
        return '�';
      }
    }
    
    // 8. SIKIŞTIRILMIŞ KODLAMA
    encodeCompact(args) {
      const text = args.TEXT.toString();
      if (!text) return this.EMPTY_CODE;
      
      let result = this.UTF8_FLAG;
      
      for (let char of text) {
        const codePoint = char.codePointAt(0);
        
        // UTF-8 benzeri sıkıştırma
        if (codePoint <= 127) {
          // 1 bayt: 0xxxxxxx
          result += codePoint.toString().padStart(3, '0');
        } else if (codePoint <= 2047) {
          // 2 bayt: 110xxxxx 10xxxxxx
          result += '1' + codePoint.toString(16).padStart(4, '0');
        } else if (codePoint <= 65535) {
          // 3 bayt: 1110xxxx 10xxxxxx 10xxxxxx
          result += '2' + codePoint.toString(16).padStart(5, '0');
        } else {
          // 4 bayt: 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
          result += '3' + codePoint.toString(16).padStart(6, '0');
        }
      }
      
      return result;
    }
    
    // 9. BASE36 KODLAMA (En kısa)
    encodeBase36(args) {
      const text = args.TEXT.toString();
      if (!text) return '0';
      
      let bigInt = 0n;
      
      for (let i = 0; i < text.length; i++) {
        const codePoint = text.codePointAt(i);
        bigInt = (bigInt << 16n) + BigInt(codePoint);
        
        if (codePoint > 0xFFFF) {
          i++; // Surrogate pair atla
        }
      }
      
      return this.BASE64_FLAG + bigInt.toString(36).toUpperCase();
    }
    
    // 10. DESTEK KONTROLÜ
    isSupported(args) {
      const text = args.TEXT.toString();
      
      for (let char of text) {
        try {
          // Karakter kodlanabiliyor mu?
          const codePoint = char.codePointAt(0);
          if (isNaN(codePoint)) return false;
          
          // Karakter çözülebiliyor mu?
          String.fromCodePoint(codePoint);
        } catch (e) {
          return false;
        }
      }
      
      return true;
    }
    
    // 11. KOD UZUNLUĞU
    getLength(args) {
      const text = args.TEXT.toString();
      const encoded = this.encodeUniversal({TEXT: text});
      return encoded.length;
    }
    
    // =============================================
    // PRIVATE HELPERS
    // =============================================
    
    // Optimize edilmiş kodlama (bulut için)
    encodeOptimized(text) {
      // Metin uzunluğuna göre en iyi yöntemi seç
      if (text.length <= 10) {
        return this.encodeUniversal({TEXT: text});
      } else if (this.isLatinOnly(text)) {
        return this.encodeCompact({TEXT: text});
      } else {
        return this.encodeBase36({TEXT: text});
      }
    }
    
    // Sadece Latin karakter kontrolü
    isLatinOnly(text) {
      return /^[\u0000-\u024F]+$/.test(text);
    }
    
    // Eski format decoder
    decodeLegacy(code) {
      // Eski 3 haneli ASCII formatını dene
      if (code.length % 3 === 0) {
        let result = '';
        for (let i = 0; i < code.length; i += 3) {
          const charCode = parseInt(code.substr(i, 3));
          if (!isNaN(charCode) && charCode > 0) {
            result += String.fromCharCode(charCode);
          }
        }
        return result;
      }
      
      return '[Eski Format]';
    }
  }
  
  // =============================================
  // EKLENTİYİ KAYDET
  // =============================================
  
  if (typeof Scratch !== 'undefined' && typeof Scratch.extensions !== 'undefined') {
    Scratch.extensions.register(new UnicodeEncoder());
  }
  
  // Test fonksiyonu - Dünya dilleri
  function testWorldLanguages() {
    const encoder = new UnicodeEncoder();
    
    console.log('=== DÜNYA DİLLERİ TESTİ ===');
    
    const testCases = [
      { text: 'Hello World', lang: 'İngilizce' },
      { text: 'Merhaba Dünya', lang: 'Türkçe' },
      { text: 'Привет мир', lang: 'Rusça' },
      { text: 'مرحبا بالعالم', lang: 'Arapça' },
      { text: '你好世界', lang: 'Çince' },
      { text: 'こんにちは世界', lang: 'Japonca' },
      { text: '안녕하세요 세계', lang: 'Korece' },
      { text: 'Γειά σου Κόσμε', lang: 'Yunanca' },
      { text: 'Bonjour le monde', lang: 'Fransızca' },
      { text: 'Hallo Welt', lang: 'Almanca' },
      { text: 'नमस्ते दुनिया', lang: 'Hintçe' },
      { text: '😀🌍🎉', lang: 'Emoji' }
    ];
    
    testCases.forEach(testCase => {
      const encoded = encoder.encodeUniversal({TEXT: testCase.text});
      const decoded = encoder.decodeUniversal({CODE: encoded});
      const correct = decoded === testCase.text;
      
      console.log(`${testCase.lang}: "${testCase.text}"`);
      console.log(`  Kod: ${encoded.substring(0, 30)}...`);
      console.log(`  Doğru: ${correct ? '✅' : '❌'}`);
      
      if (!correct) {
        console.log(`  Beklenen: "${testCase.text}"`);
        console.log(`  Alınan: "${decoded}"`);
      }
    });
    
    console.log('=== TEST TAMAMLANDI ===');
  }
  
  setTimeout(testWorldLanguages, 1000);
  
})(typeof Scratch !== 'undefined' ? Scratch : {});
