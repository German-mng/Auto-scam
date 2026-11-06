    const basePrice = 20000000;
    const currentConfig = {
      color: { price: 0, label: 'Черный', img: 'img/blackbmw.png' },
      wheel: { price: 0, label: 'R21', img: 'img/r21.png' },
      interior: { price: 0, label: 'Эко-кожа', img: 'img/stokbmw.png' },
      engine: { price: 0, label: '3L V6+ e-motor', spec: '3L V6+ e-motor' }
    };

    function selectOption(card) {
      const type = card.dataset.type;
      const price = parseInt(card.dataset.price);
      const label = card.dataset.label;
      const spec = card.querySelector('.option-card-spec')?.textContent || '';

      // Активный класс
      const group = document.getElementById(type + 'Options');
      group.querySelectorAll('.option-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      // Обновление конфига
      currentConfig[type] = { price, label, spec };

      // Для кузова, колёс и салона — подмена фото
      if (type === 'color' || type === 'wheel' || type === 'interior') {
        updatePreviewImage(type, card.dataset.img);
      }

      updateTags();
      updatePrice();
    }

    function updatePreviewImage(type, newSrc) {
      let el;
      if (type === 'color') el = document.getElementById('carImage');
      else if (type === 'wheel') el = document.getElementById('wheelImage');
      else if (type === 'interior') el = document.getElementById('interiorImage');

      if (el) {
        el.classList.add('switching');
        setTimeout(() => {
          el.src = newSrc;
          el.classList.remove('switching');
        }, 100);
      }
    }

    function updateTags() {
      document.getElementById('tagColor').textContent = '🎨 ' + currentConfig.color.label;
      document.getElementById('tagWheel').textContent = '🛞 ' + currentConfig.wheel.label;
      document.getElementById('tagInterior').textContent = '🪑 ' + currentConfig.interior.label;
      document.getElementById('tagEngine').textContent = '🔥 ' + currentConfig.engine.label;
    }

    function updatePrice() {
      let sum = currentConfig.color.price + currentConfig.wheel.price + currentConfig.interior.price + currentConfig.engine.price;
      document.querySelectorAll('.checkbox-item input:checked').forEach(cb => sum += parseInt(cb.dataset.price));

      document.getElementById('optionsPrice').textContent = sum.toLocaleString() + ' ₽';
      document.getElementById('finalPriceDisplay').textContent = (basePrice + sum).toLocaleString() + ' ₽';
    }

    function orderCar() {
      const final = document.getElementById('finalPriceDisplay').textContent;
      alert(`✅ Заказ принят!\n\nBMW XM\nКузов: ${currentConfig.color.label}\nДиски: ${currentConfig.wheel.label}\nСалон: ${currentConfig.interior.label}\nДвигатель: ${currentConfig.engine.label}\n\nИтого: ${final}`);
    }

    function resetConfig() {
      if (confirm('Сбросить всё?')) location.reload();
    }

    updatePrice();