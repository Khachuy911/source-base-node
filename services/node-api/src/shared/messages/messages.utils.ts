import { LanguageCode } from '@lib/common/enum/language-code.enum';
import { ErrorMessageFields } from './messages.enum';
import { ErrorMessages } from './error-messages';

export class MessageUtils {
  static CreateMessage(field: ErrorMessageFields, language: LanguageCode = 'en', ...param: any[]) {
    switch (language) {
      case 'en': {
        return field.split('.').reduce((acc, curr) => {
          if (typeof acc[curr] === 'function') {
            return acc[curr](...param);
          }

          return acc[curr];
        }, ErrorMessages.English);
      }
      case 'ko': {
        return field.split('.').reduce((acc, curr) => {
          if (typeof acc[curr] === 'function') {
            return acc[curr](...param);
          }

          return acc[curr];
        }, ErrorMessages.Korean);
      }

      case 'zh': {
        return field.split('.').reduce((acc, curr) => {
          if (typeof acc[curr] === 'function') {
            return acc[curr](...param);
          }

          return acc[curr];
        }, ErrorMessages.Chinese);
      }
      default:
        return null;
    }
  }
}
