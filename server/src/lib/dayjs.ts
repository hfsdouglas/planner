import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import 'dayjs/locale/pt-br';

dayjs.extend(localizedFormat);
dayjs.locale('pt-br');

export { dayjs }