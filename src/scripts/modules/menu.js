const api = require('./api');

const menu = {
  init: ({ tree, mainClass }) => {
    const config = {
      method: 'GET',
      url: `/api/catalog_system/pub/category/tree/${tree}`
    }

    const callbackMenu = data => {
      menu.render_v2({ data, main: mainClass });
    }

    api(config, callbackMenu);
  },

  render: ({ data, main }) => {

    const $mainClass = typeof main == 'string' ? document.querySelector(main) : main;
    const mainClassWithoutDot = typeof main == 'string' ? main.replace('.', '') : main.classList[0].replace('.', '');

    data.forEach( category => {

      const { name, url, hasChildren, children } = category;

      console.log('category', category);

      const newCategory = document.createElement('div');
      newCategory.classList.add(`${mainClassWithoutDot}-item`);

      const newCategoryLink = document.createElement('a');
      newCategoryLink.href = url;
      newCategoryLink.textContent = name;

      const newCategoryBox = document.createElement('div');
      newCategoryBox.classList.add(`${mainClassWithoutDot}-box-category`);

      newCategory.appendChild(newCategoryLink);
      newCategory.appendChild(newCategoryBox);
      $mainClass.appendChild(newCategory);
      
      if (hasChildren) {
        menu.render({data: children, main: newCategoryBox});
      }
      
    } );
  },

  render_v2: ({ data, main }) => {
    
    const levels = ['principal', 'primary', 'secondary', 'tertiary', 'quaternary'];
    const mainWithoutDot = main.replace('.', '');
    const $selectedClass = document.querySelector(main);

    const writeCategories = ({ category, currentLevel }) => {

      const { name, url, hasChildren, children } = category;
 
      const newCategoryClass = `${mainWithoutDot}-item--${levels[currentLevel]}`;
      const newCategoryBoxClass = `${mainWithoutDot}-box-category--${levels[currentLevel + 1]}`;

      const newCategory = document.createElement('div');
      newCategory.classList.add(newCategoryClass);

      const newCategoryLink = document.createElement('a');
      newCategoryLink.href = url;
      newCategoryLink.textContent = name;

      newCategory.appendChild(newCategoryLink);
      
      if(hasChildren) {

        const newCategoryBox = document.createElement('div');
        newCategoryBox.classList.add(newCategoryBoxClass);

        children.forEach(category => {
          newCategoryBox.appendChild(writeCategories({ category, currentLevel: currentLevel + 1 }));
        });

        newCategory.appendChild(newCategoryBox);

      }

      return newCategory;
    }

    data.forEach(category => {
      $selectedClass.appendChild(writeCategories({ category, currentLevel: 0 }));
    });
  }
}

module.exports = menu;