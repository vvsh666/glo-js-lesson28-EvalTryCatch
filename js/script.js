const filterByType = (type, ...values) =>
        values.filter((value) => typeof value === type), //функция которая фильтрует массив полученный из переданной строки, сравнивая тип каждого элемента с типом из селекта, результатом будет массив
    hideAllResponseBlocks = () => {
        //функция скрытия блоков с информацией
        const responseBlocksArray = Array.from(
            document.querySelectorAll("div.dialog__response-block")
        ); //получаем коллекцию блоков и преобразовываем в массив
        responseBlocksArray.forEach((block) => (block.style.display = "none")); //устанавливаем для каждого элемента свойство display: none
    },
    showResponseBlock = (blockSelector, msgText, spanSelector) => {
        hideAllResponseBlocks(); //функция отображения блока с информацией, получает в качестве аргументов два селектора и строку с сообещением
        document.querySelector(blockSelector).style.display = "block"; // устанавливаем для блока с переданныи селектором своиство display: block
        if (spanSelector) {
            //если второй селектор был передан,
            document.querySelector(spanSelector).textContent = msgText; //то помещаем в спан с данным селектором строку с сообщением
        }
    },
    showError = (msgText) =>
        showResponseBlock(".dialog__response-block_error", msgText, "#error"), // функция вывода ошибки на страницу. Вызывает функцию отображения блока с информацией. В качестве пораметров передаются селекторы (один с классом, другой с id) и строка с сообщением
    showResults = (msgText) =>
        showResponseBlock(".dialog__response-block_ok", msgText, "#ok"), // функция вывода результата на страницу. Вызывает функцию отображения блока с информацией. В качестве пораметров передаются селекторы (один с классом, другой с id) и строка с сообщением
    showNoResults = () =>
        showResponseBlock(".dialog__response-block_no-results"), // функция которая вызывается когда нет значения в поле ввода, очищает блок с информацией
    tryFilterByType = (type, values) => {
        // вызываем функцию с параметрами из селекта и инпута
        try {
            // основной блок кода с обработкой ошибок
            const valuesArray = eval(`filterByType('${type}', ${values})`).join(
                ", "
            ); // в константу valuesArray записываем результат выполнения функции filterByType (результат преобразуем из массива в строку через запятую)
            const alertMsg = valuesArray.length // если полученный результат не пустой то в константу alertMsg помещаем
                ? `Данные с типом ${type}: ${valuesArray}` // сообщение что данные выбранного типа есть и перечисляем их (значение константы valuesArray)
                : `Отсутствуют данные типа ${type}`; // если полученный результат пустой, то сообщение что данные выбранного типа отсутствуют
            showResults(alertMsg); // вызываем функцию showResults и передаем ей значение константы alertMsg
        } catch (e) {
            // вызывается блок обработки ошибок в случае ошибки в основном блоке
            showError(`Ошибка: ${e}`); // вызываем функцию showError и передаем ей строку с текстом ошибки
        }
    };

const filterButton = document.querySelector("#filter-btn"); // Получаем кнопку "Фильтровать"

filterButton.addEventListener("click", (e) => {
    // вешаем на нее обработчик по клику
    const typeInput = document.querySelector("#type"); // получаем select с выбором типа данных
    const dataInput = document.querySelector("#data"); // получаем инпут ввода строки с данными

    if (dataInput.value === "") {
        // проверка на отсутствие данных в строке ввода
        dataInput.setCustomValidity("Поле не должно быть пустым!"); // если строка пустая выводим подсказку встроенным методом setCustomValidity
        showNoResults(); // и вызываем функцию showNoResults
    } else {
        // если значение в поле ввода есть
        dataInput.setCustomValidity(""); // передаем в метод setCustomValidity пустую строку, это означает что значение корректно
        e.preventDefault(); // отменяем стандартное поведение при отправке формы (перезагрузку)
        tryFilterByType(typeInput.value.trim(), dataInput.value.trim()); // передаем в функцию значения из селекта и инпута (убираем лишние пробелы в начале и в конце) и вызываем ее
    }
});
