import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы
    before.reverse().forEach(subName => {                            // перебираем нужный массив идентификаторов
      root[subName] = cloneTemplate(subName);            // клонируем и получаем объект, сохраняем в таблице
      root.container.prepend(root[subName].container);    // добавляем к таблице после (append) или до (prepend)
    }); 

    after.forEach(subName => {                            // перебираем нужный массив идентификаторов
      root[subName] = cloneTemplate(subName);            // клонируем и получаем объект, сохраняем в таблице
      root.container.append(root[subName].container);    // добавляем к таблице после (append) или до (prepend)
    });

    // @todo: #1.3 —  обработать события и вызвать onAction()

    root.container.addEventListener('change', () => {
        onAction();
    });

    root.container.addEventListener('reset', () => {
        setTimeout(onAction);
    });

    root.container.addEventListener('submit', (e) => {
        e.preventDefault();
        onAction(e.submitter);
    });

    const render = (data) => {
        // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
        // берем данные - массив объектов => преобразуем: берем каждый элемент массива, те объект item
        // с помощью функции из utils.js создаем клон шаблона, функция возвращает объект со свойствами:
        //  - сам DOM элемент на основе шаблона и именованные элементы data name: date, customer и тд 
        // заполняем созданный на основе шаблона элемент текстовым содержимым
        // полностью готовый DOM-элемент
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate);
            Object.keys(item).forEach(key => { 
                if (row.elements[key]) {
                    row.elements[key].textContent = item[key];
                }
            });
            return row.container;
         })
        // замена старых строк новыми в родительском элементе
        root.elements.rows.replaceChildren(...nextRows);
    }

    return {...root, render};
}