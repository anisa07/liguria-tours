# Best Practices for Writing Playwright Tests

## Technologies

- Framework: Playwright
- Language Typescript

## Test Project structure and responsibilities

| Component       | Location                | Examples |
|-----------------|-------------------------|----------|
| Test scenarios  | `/tests/e2e/specs`      | E1       |
| Page Objects    | `/tests/e2e/pages`      | E2       |
| Test Data       | `/tests/e2e/test-data`  | E3       |
| Utils           | `/tests/e2e/utils`      | -        |
| Mocks           | `/tests/e2e/test-mocks` | -        |

## E1: Typical Test scenario example

``` Typescript
// tms-34-buy-products.spec.ts
import { test } from '../fixtures';             // ✅ import test to use page objects
import { defaultProduct } from '../test-data';  // ✅ import test data
import { productsMock } from '../test-mocks';   // ✅ optional: import mocks

// ✅ Test suite name have feature ID for clear mapping
// ✅ Proper test organization using tags
test.describe('TMS-34: Buy products feature', { tag: ['@smoke', '@products'] },  () => {
  // ✅ Setup initial state and reach Entry point before approaching test
  test.beforeEach('Setup products', async ( { productsListPage }) => {
    await productsMock.setupDefault(); // optional
    await productsListPage.open();
  });

  // ✅ STRAIGHTFORWARD test scenario structure
  // ✅ FOCUS ON user actions, not technical operations
  // ✅ Use ONLY Page Objects and user actions in test. No technical or complex logic
  // ✅ Optional: Using test data objects (defaultProduct and updatedProduct) to drive test flow
  // ✅ NEVER use for- or if- conditions in test scenario
  // ✅ Proper async/await usage for all steps
  test('place product to cart', { tag: ['@critical'] }, async ({ 
      productsListPage, productPage, user, header, cartPage, cartProductPage, 
    }) => {
    await productsListPage.findProduct(defaultProduct);           
    await productsListPage.validateProductInList(defaultProduct);

    await productsListPage.selectProduct(defaultProduct);
    await productPage.validateProduct(defaultProduct);

    const updatedProduct = await productPage
      .selectProductDetails(defaultProduct, { size: 'L', amount: 3 });
    await productPage.addToCart();
    await productPage.validateSuccessModal();
    await user.keyPress('Escape');
    await header.validateCartIndicator(1);

    await header.openCart();
    await cartPage.validateProductsList([ updatedProduct ]);

    await cartPage.selectProduct(updatedProduct);
    await cartProductPage.validateProductDetails(updatedProduct);
  });
  
  test('no products in card', { tag: ['@major', '@edge-case'] }, async ({ ... }) => { ... });
  ...
});
```

## E2: Typical Page Object example

``` Typescript
// products-list.page.ts
import { expect } from '@playwright/test';          // ✅ Import expect for validation actions
import { BasePage } from './BasePage';              // ✅ Import BasePage
import type { Product } from '../test-data/types';  // ✅ Import Test Data type
import { TIMEOUT } from '../utils/timeouts';

// ✅ Page Object CONSIST OF: elements or methods
// ✅ Methods can be ONLY: INTERACTIONs or VALIDATIONs
// ✅ NO constructor. Reuse from BasePage
export class ProductsListPage extends BasePage {
  // ✅ DATA elements: Use itemProp() for itemprop attribute Google microdata
  // ✅ ALL OTHER elements: use testId() for data-testid attributes
  // ✅ ADD data-testid to application code if absent
  // Page Object Elements
  searchProduct = this.testId('search-product-input');
  searchButton = this.testId('search-button');
  productsList = this.testId('product-item');           // multiple elements
  // ✅ USE arrow function to locate elements with dynamic values
  productByName = (name: string) => this.productsList.filter({
    has: this.page.locator('[itemprop=name]', { hasText: name })
  });
  // ✅ Override open() from BasePage in case Entry point require more than default open by url
  override async open() {
    await this.open();
    await new LoginPage(this.page).loginAsDefaultUser();
    // ✅ USE PAGE_TO_LOAD for page navigation, loading states, major updates etc.
    await expect(this.topHeader).toBeVisible({ timeout: TIMEOUT.PAGE_TO_LOAD });
    await new Header(this.page).select('Buy Products');
    await this.toBeOpened();
  }
  // ✅ INTERACTION method
  // ✅ NO validations (expect) only user actions
  // ✅ Wrap interaction body with this.step()
  // ✅ Optional: User interactions can be driven by test data
  // Page Object methods
  async findProduct(product: Product) {
    await this.step(`Find product by name ${product.name}`, async () => {
      await searchProduct.fill(product.name);
      await searchButton.click();
    });
  }
  // ✅ VALIDATION method 
  // ✅ NO interactions with application like click, fill, check etc.
  // ✅ Wrap interaction body with this.step()
  // ✅ Optional: Validations can be driven by test data
  async validateProductInList(product: Product) {
    await this.step(`Validate that product ${product.name} is in Products list`, async () => {
      await expect(this.productByName(product.name)).toBeVisible();
    });
  }
  ...
}
// product-details.ts
export class CartProductPage extends BasePage {
  // Page Object Elements
  sizeSelector = this.testId('size-selector');
  amountInput = this.testId('amount-input');
  // ✅ No open() method required. Reuse from BasePage if needed

  // ✅ INTERACTION Method
  // ✅ Complex logic, if- and for- statements can be processed in Page Objects
  // ✅ If test data was changed or added during interaction method can return updated test data
  // Page Object methods
  async selectProductDetails(product: Product, select: Partial<{ size: 'S' | 'M' | 'L' | 'XL', amount: number }>): Promise<Product> {
    if (select.size) {
      await sizeSelector.check(select.size);
    }
    if (select.amount) {
      await amountInput.check(select.amount);
    }
    return { ...product, productSize: select.size, amount: select.amount };
  }
}

// cart-product.page.ts
export class CartProductPage extends BasePage {
  // ✅ DATA elements: Use itemProp() for itemprop attribute Google microdata
  // Page Object Elements
  productName = this.itemProp('name');
  productPrice = this.itemProp('price');
  productDescription = this.itemProp('description');
  productSize = this.itemProp('size');
  // ✅ No open() method required. Reuse from BasePage if needed

  // ✅ VALIDATION method 
  // Page Object methods
  async validateProductDetails(defaultProduct: Product) {
    await this.step(`Validate product ${product.name} details`, async () => {
      await expect(this.productName).toHaveText(product.name);
      await expect(this.productPrice).toHaveText(product.cost);
      await expect(this.productDescription).toHaveText(product.fullDescription);
      await expect(this.productSize).toHaveText(product.size);
    });
  }
}

// fixtures.ts
import { test as base } from '@playwright/test';
import { expect } from './custom-assertions/custom-expects';
import {
  ProductsListPage,
  ProductPage,
  ...,
  CartProductPage
} from './pages';
import { UserActions } from './utils/user-actions';

// Define the type for our fixtures
interface PageFixtures {
  user: UserActions;
  // Page Objects
  productsListPage: ProductsListPage;
  productPage: ProductPage;
  ...
  cartProductPage: CartProductPage;
}

// Extend the base test with our page object fixtures
export const test = base.extend<PageFixtures>({
  user: async ({ page }, use) => {
    await use(new UserActions(page));
  },
  // Page Objects
  productsListPage: async ({ page }, use) => {
    await use(new ProductsListPage(page, { url: '/products', title: 'All products', h1: 'Products' }));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductsListPage(page, { url: '/product/{product-id}' }));
  },
  ...
  cartProductPage: async ({ page }, use) => {
    await use(new CartProductPage(page, { url: '/cart-product' }));
  },
});

// pages/index.ts
export * from './products-list.page';
export * from './product.page';
...
export * from './cart-product.page';
```

## E3: Typical Test Data example

``` Typescript
//product.type.ts
export interface Product  {
  id: number;
  name: string;
  category: string;
  cost: CostType;
  fullDescription?: string;
  productSize?: 'S' | 'M' | 'L' | 'XL';
  available: Date;
  amount?: number;
}

// test-data/types/index.ts
export * from './product.type';

//products.data.ts
export const defaultProduct: Product = {
  id: 3234;
  name: 'Amsterdam XXX';
  category: 'T-shirt';
  cost: { main: 10, decimal: 50, currency: 'EUR' };
  productSize: 'M';
  available: new Date('2024-01-15');
}

// test-data/index.ts
export * from '.products.data';
```

## Fast checklist

### Test scenario

- [ ] MUST Have feature ID.
- [ ] Straightforward scenario. NO if- or for- inside test methods.
- [ ] Use Page Objects from test params.
- [ ] STARTS with open() method with optional setup before.
- [ ] ENDS with validation.
- [ ] Every line use methods from Page Objects or user actions.
- [ ] USE tags for suite and tests.
- [ ] NO other code in test file. Move complex code to Page Objects, Utils, Mocks etc.
- [ ] NO wait methods in test scenario.

### Page Object

- [ ] Extend BasePage.
- [ ] NO constructor needed (reuse BasePage constructor).
- [ ] Elements use `testId(...)` method to locate by data-testid.
- [ ] If no data-testid attribute in application code ADD data-testid attribute to the application code.
- [ ] To locate elements with dynamic values like get by id or name USE arrow functions.
- [ ] If Page can be navigate by url no need to create open method. Reuse BasePage method instead.
- [ ] If Page Entry point require multiple actions than override open method to reach Page.
- [ ] Every Page Object action MUST be wrapped in this.step method.
- [ ] Only two types of actions available: NAVIGATION actions and VALIDATION actions
- [ ] NAVIGATION actions should have NO validations (expect)
- [ ] VALIDATION actions should have NO interaction actions like: click, fill, check etc. Only expect and maybe some calculation logic
- [ ] Every expect in Page Object MUST have await.
- [ ] Page Object MUST be registered in fixtures.ts
- [ ] Page Object MUST be added to `/pages/index.ts` file

### Test data

- [ ] Test data MUST have interface (test-data-type).
- [ ] Test data can have different implementations of test-data-type that can be used in test scenarios.
- [ ] test-data-type MUST be added in `/test-data/types/index.ts`
- [ ] Test data implementation MUST be added in `/test-data/index.ts`
