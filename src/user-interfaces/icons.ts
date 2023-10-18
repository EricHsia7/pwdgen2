const icon_arrow = `<svg stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" version="1.1" viewBox="0 0 64 64" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M19.8046 0.9191L49.1309 30.2454C49.4094 30.5239 49.6044 30.8024 49.7158 31.0809C49.8272 31.3594 49.8829 31.6658 49.8829 32C49.8829 32.3342 49.8272 32.6406 49.7158 32.9191C49.6044 33.1976 49.4094 33.4761 49.1309 33.7546L19.8046 63.0809C19.1918 63.6936 18.412 64 17.4651 64C16.5182 64 15.7384 63.6936 15.1257 63.0809C14.4573 62.4125 14.1231 61.6188 14.1231 60.6997C14.1231 59.7807 14.4573 58.987 15.1257 58.3185L41.4442 32L15.1257 5.6815C14.4016 4.9574 14.0674 4.1497 14.1231 3.2585C14.1788 2.3673 14.513 1.6153 15.1257 1.0026C15.7941 0.3342 16.5878 7.10543e-15 17.5069 7.10543e-15C18.426 7.10543e-15 19.1918 0.3064 19.8046 0.9191Z" fill-rule="nonzero" opacity="1" stroke="none"/></svg>`;
const icon_copy = `<svg stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" version="1.1" viewBox="0 0 64 64" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M9.6 64C8.32 64 7.2 63.52 6.24 62.56C5.28 61.6 4.8 60.48 4.8 59.2L4.8 10.96L9.6 10.96L9.6 59.2L47.52 59.2L47.52 64L9.6 64ZM19.2 54.4C17.92 54.4 16.8 53.92 15.84 52.96C14.88 52 14.4 50.88 14.4 49.6L14.4 4.8C14.4 3.52 14.88 2.4 15.84 1.44C16.8 0.48 17.92 0 19.2 0L54.4 0C55.68 0 56.8 0.48 57.76 1.44C58.72 2.4 59.2 3.52 59.2 4.8L59.2 49.6C59.2 50.88 58.72 52 57.76 52.96C56.8 53.92 55.68 54.4 54.4 54.4L19.2 54.4ZM19.2 49.6L54.4 49.6L54.4 4.8L19.2 4.8L19.2 49.6ZM19.2 49.6L19.2 4.8L19.2 49.6Z" fill-rule="nonzero" opacity="1" stroke="none" /></svg>`;
const icon_date = `<svg stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" version="1.1" viewBox="0 0 64 64" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M8 64C6.72 64 5.6 63.52 4.64 62.56C3.68 61.6 3.2 60.48 3.2 59.2L3.2 9.6C3.2 8.32 3.68 7.2 4.64 6.24C5.6 5.28 6.72 4.8 8 4.8L13.2 4.8L13.2 0L18.4 0L18.4 4.8L45.6 4.8L45.6 0L50.8 0L50.8 4.8L56 4.8C57.28 4.8 58.4 5.28 59.36 6.24C60.32 7.2 60.8 8.32 60.8 9.6L60.8 59.2C60.8 60.48 60.32 61.6 59.36 62.56C58.4 63.52 57.28 64 56 64L8 64ZM8 59.2L56 59.2L56 24.8L8 24.8L8 59.2ZM8 20L56 20L56 9.6L8 9.6L8 20ZM8 20L8 9.6L8 20Z" fill-rule="nonzero" opacity="1" stroke="none"/></svg>`;
const icon_text = `<svg stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" version="1.1" viewBox="0 0 64 64" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M16.0434 49.9403L35.9167 49.9403C36.5231 49.9403 37.0306 49.7343 37.4394 49.3222C37.8481 48.9102 38.0525 48.3986 38.0525 47.7874C38.0525 47.1762 37.8481 46.6703 37.4394 46.2698C37.0306 45.8692 36.5231 45.6688 35.9167 45.6688L16.0434 45.6688C15.4371 45.6688 14.9295 45.8749 14.5207 46.2869C14.112 46.6989 13.9077 47.2105 13.9077 47.8217C13.9077 48.4329 14.112 48.9388 14.5207 49.3393C14.9295 49.74 15.4371 49.9403 16.0434 49.9403ZM16.0434 34.1357L47.9566 34.1357C48.5629 34.1357 49.0705 33.9297 49.4793 33.5177C49.888 33.1056 50.0923 32.594 50.0923 31.9829C50.0923 31.3717 49.888 30.8658 49.4793 30.4652C49.0705 30.0646 48.5629 29.8643 47.9566 29.8643L16.0434 29.8643C15.4371 29.8643 14.9295 30.0703 14.5207 30.4823C14.112 30.8944 13.9077 31.406 13.9077 32.0171C13.9077 32.6283 14.112 33.1342 14.5207 33.5348C14.9295 33.9354 15.4371 34.1357 16.0434 34.1357ZM16.0434 18.3312L47.9566 18.3312C48.5629 18.3312 49.0705 18.1251 49.4793 17.7131C49.888 17.3011 50.0923 16.7895 50.0923 16.1783C50.0923 15.5671 49.888 15.0612 49.4793 14.6607C49.0705 14.26 48.5629 14.0597 47.9566 14.0597L16.0434 14.0597C15.4371 14.0597 14.9295 14.2657 14.5207 14.6778C14.112 15.0898 13.9077 15.6014 13.9077 16.2126C13.9077 16.8238 14.112 17.3297 14.5207 17.7302C14.9295 18.1308 15.4371 18.3312 16.0434 18.3312ZM5.42987 64C3.95353 64 2.67945 63.4641 1.60763 62.3923C0.535815 61.3205-9.41179e-05 60.0464-9.41179e-05 58.5701L-9.41179e-05 5.42995C-9.41179e-05 3.95361 0.535815 2.67954 1.60763 1.60772C2.67945 0.535907 3.95353 0 5.42987 0L58.5701 0C60.0465 0 61.3205 0.535907 62.3924 1.60772C63.4642 2.67954 64.0001 3.95361 64.0001 5.42995L64.0001 58.5701C64.0001 60.0464 63.4642 61.3205 62.3924 62.3923C61.3205 63.4641 60.0465 64 58.5701 64L5.42987 64ZM5.42987 59.7286L58.5701 59.7286C58.8598 59.7286 59.1253 59.6079 59.3667 59.3666C59.608 59.1252 59.7286 58.8597 59.7286 58.5701L59.7286 5.42995C59.7286 5.14031 59.608 4.87481 59.3667 4.63343C59.1253 4.39211 58.8598 4.27145 58.5701 4.27145L5.42987 4.27145C5.14023 4.27145 4.87473 4.39211 4.63334 4.63343C4.39203 4.87481 4.27137 5.14031 4.27137 5.42995L4.27137 58.5701C4.27137 58.8597 4.39203 59.1252 4.63334 59.3666C4.87473 59.6079 5.14023 59.7286 5.42987 59.7286ZM4.27137 4.27145L4.27137 59.7286L4.27137 4.27145Z" fill-rule="nonzero" opacity="1" stroke="none"/></svg>`;
const icon_hashtag = `<svg clip-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" version="1.1" viewBox="0 0 64 64" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="m10.353 62.118 4.0471-16h-14.4l1.4118-5.647h14.4l4.2353-16.941h-16.282l1.4118-5.647h16.282l3.953-16h5.5529l-3.9529 16h17.035l3.9529-16h5.5529l-3.9529 16h14.4l-1.4118 5.647h-14.4l-4.2353 16.941h16.282l-1.4118 5.647h-16.282l-3.953 16h-5.647l4.047-16h-17.035l-3.9529 16h-5.6471zm11.012-21.647h17.035l4.2353-16.941h-17.035l-4.2353 16.941z"/></svg>`;
const icon_password = `<svg clip-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" version="1.1" viewBox="0 0 64 64" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="m17.454 49.454c-4.8484 0-8.9696-1.6969-12.364-5.0909-3.3939-3.3939-5.0909-7.5151-5.0909-12.364s1.697-8.9697 5.0909-12.364c3.3939-3.394 7.5152-5.0909 12.364-5.0909 3.7819 0 6.9697 0.909 9.5637 2.7272 2.5939 1.8182 4.5212 4.2303 5.7818 7.2364h31.2v14.982h-7.7091v9.9636h-13.527v-9.9636h-9.9636c-1.2606 3.0061-3.1879 5.4182-5.7818 7.2364-2.594 1.8182-5.7818 2.7272-9.5637 2.7272zm0-4.3636c3.4425 0 6.2667-1.1394 8.4728-3.4182 2.206-2.2788 3.503-4.4606 3.8909-6.5454h17.6v9.9636h4.5091v-9.9636h7.7091v-6.2546h-29.818c-0.3879-2.0848-1.6849-4.2666-3.8909-6.5454-2.2061-2.2788-5.0303-3.4182-8.4728-3.4182-3.6363 0-6.7272 1.2727-9.2727 3.8182-2.5455 2.5454-3.8182 5.6363-3.8182 9.2727s1.2727 6.7273 3.8182 9.2727c2.5455 2.5455 5.6364 3.8182 9.2727 3.8182zm0-8.1454c1.4061 0 2.5819-0.4728 3.5273-1.4182 0.9455-0.9455 1.4182-2.1212 1.4182-3.5273s-0.4727-2.5818-1.4182-3.5273c-0.9454-0.9454-2.1212-1.4182-3.5273-1.4182-1.406 0-2.5818 0.4728-3.5272 1.4182-0.9455 0.9455-1.4182 2.1212-1.4182 3.5273s0.4727 2.5818 1.4182 3.5273c0.9454 0.9454 2.1212 1.4182 3.5272 1.4182z"/></svg>`;
const icon_check_strong = '<svg stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" version="1.1" viewBox="0 0 64 64" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M43.68 27.76C44.9067 27.76 45.9333 27.3467 46.76 26.52C47.5867 25.6933 48 24.6667 48 23.44C48 22.2133 47.5867 21.1867 46.76 20.36C45.9333 19.5333 44.9067 19.12 43.68 19.12C42.4533 19.12 41.4267 19.5333 40.6 20.36C39.7733 21.1867 39.36 22.2133 39.36 23.44C39.36 24.6667 39.7733 25.6933 40.6 26.52C41.4267 27.3467 42.4533 27.76 43.68 27.76ZM20.32 27.76C21.5467 27.76 22.5733 27.3467 23.4 26.52C24.2267 25.6933 24.64 24.6667 24.64 23.44C24.64 22.2133 24.2267 21.1867 23.4 20.36C22.5733 19.5333 21.5467 19.12 20.32 19.12C19.0933 19.12 18.0667 19.5333 17.24 20.36C16.4133 21.1867 16 22.2133 16 23.44C16 24.6667 16.4133 25.6933 17.24 26.52C18.0667 27.3467 19.0933 27.76 20.32 27.76ZM32 49.52C35.52 49.52 38.76 48.5733 41.72 46.68C44.68 44.7867 46.8267 42.2133 48.16 38.96L15.84 38.96C17.2267 42.2133 19.3867 44.7867 22.32 46.68C25.2533 48.5733 28.48 49.52 32 49.52ZM32 64C27.6267 64 23.4933 63.16 19.6 61.48C15.7067 59.8 12.3067 57.5067 9.4 54.6C6.49333 51.6933 4.2 48.2933 2.52 44.4C0.84 40.5067 0 36.3467 0 31.92C0 27.5467 0.84 23.4133 2.52 19.52C4.2 15.6267 6.49333 12.24 9.4 9.36C12.3067 6.48 15.7067 4.2 19.6 2.52C23.4933 0.84 27.6533 0 32.08 0C36.4533 0 40.5867 0.84 44.48 2.52C48.3733 4.2 51.76 6.48 54.64 9.36C57.52 12.24 59.8 15.6267 61.48 19.52C63.16 23.4133 64 27.5733 64 32C64 36.3733 63.16 40.5067 61.48 44.4C59.8 48.2933 57.52 51.6933 54.64 54.6C51.76 57.5067 48.3733 59.8 44.48 61.48C40.5867 63.16 36.4267 64 32 64ZM32 59.2C39.5733 59.2 46 56.5467 51.28 51.24C56.56 45.9333 59.2 39.52 59.2 32C59.2 24.4267 56.56 18 51.28 12.72C46 7.44 39.5733 4.8 32 4.8C24.48 4.8 18.0667 7.44 12.76 12.72C7.45333 18 4.8 24.4267 4.8 32C4.8 39.52 7.45333 45.9333 12.76 51.24C18.0667 56.5467 24.48 59.2 32 59.2Z" fill="var(--check-strong-icon)" fill-rule="nonzero" opacity="1" stroke="none"/></svg>';
const icon_check_passable = '<svg stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" version="1.1" viewBox="0 0 64 64" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M43.68 27.76C44.9067 27.76 45.9333 27.3467 46.76 26.52C47.5867 25.6933 48 24.6667 48 23.44C48 22.2133 47.5867 21.1867 46.76 20.36C45.9333 19.5333 44.9067 19.12 43.68 19.12C42.4533 19.12 41.4267 19.5333 40.6 20.36C39.7733 21.1867 39.36 22.2133 39.36 23.44C39.36 24.6667 39.7733 25.6933 40.6 26.52C41.4267 27.3467 42.4533 27.76 43.68 27.76ZM20.32 27.76C21.5467 27.76 22.5733 27.3467 23.4 26.52C24.2267 25.6933 24.64 24.6667 24.64 23.44C24.64 22.2133 24.2267 21.1867 23.4 20.36C22.5733 19.5333 21.5467 19.12 20.32 19.12C19.0933 19.12 18.0667 19.5333 17.24 20.36C16.4133 21.1867 16 22.2133 16 23.44C16 24.6667 16.4133 25.6933 17.24 26.52C18.0667 27.3467 19.0933 27.76 20.32 27.76ZM32 49.52C35.52 49.52 38.76 48.5733 41.72 46.68C44.68 44.7867 46.8267 42.2133 48.16 38.96L44 38.96C42.7733 41.0933 41.0933 42.7333 38.96 43.88C36.8267 45.0267 34.5333 45.6 32.08 45.6C29.5733 45.6 27.24 45.04 25.08 43.92C22.92 42.8 21.2533 41.1467 20.08 38.96L15.84 38.96C17.2267 42.2133 19.3867 44.7867 22.32 46.68C25.2533 48.5733 28.48 49.52 32 49.52ZM32 64C27.6267 64 23.4933 63.16 19.6 61.48C15.7067 59.8 12.3067 57.5067 9.4 54.6C6.49333 51.6933 4.2 48.2933 2.52 44.4C0.84 40.5067 0 36.3467 0 31.92C0 27.5467 0.84 23.4133 2.52 19.52C4.2 15.6267 6.49333 12.24 9.4 9.36C12.3067 6.48 15.7067 4.2 19.6 2.52C23.4933 0.84 27.6533-3.55271e-15 32.08-3.55271e-15C36.4533-3.55271e-15 40.5867 0.84 44.48 2.52C48.3733 4.2 51.76 6.48 54.64 9.36C57.52 12.24 59.8 15.6267 61.48 19.52C63.16 23.4133 64 27.5733 64 32C64 36.3733 63.16 40.5067 61.48 44.4C59.8 48.2933 57.52 51.6933 54.64 54.6C51.76 57.5067 48.3733 59.8 44.48 61.48C40.5867 63.16 36.4267 64 32 64ZM32 59.2C39.5733 59.2 46 56.5467 51.28 51.24C56.56 45.9333 59.2 39.52 59.2 32C59.2 24.4267 56.56 18 51.28 12.72C46 7.44 39.5733 4.8 32 4.8C24.48 4.8 18.0667 7.44 12.76 12.72C7.45333 18 4.8 24.4267 4.8 32C4.8 39.52 7.45333 45.9333 12.76 51.24C18.0667 56.5467 24.48 59.2 32 59.2Z" fill="var(--check-passable-icon)" fill-rule="nonzero" opacity="1" stroke="none"/></svg>';
const icon_check_fragile = '<svg stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" version="1.1" viewBox="0 0 64 64" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M43.68 27.76C44.9067 27.76 45.9333 27.3467 46.76 26.52C47.5867 25.6933 48 24.6667 48 23.44C48 22.2133 47.5867 21.1867 46.76 20.36C45.9333 19.5333 44.9067 19.12 43.68 19.12C42.4533 19.12 41.4267 19.5333 40.6 20.36C39.7733 21.1867 39.36 22.2133 39.36 23.44C39.36 24.6667 39.7733 25.6933 40.6 26.52C41.4267 27.3467 42.4533 27.76 43.68 27.76ZM20.32 27.76C21.5467 27.76 22.5733 27.3467 23.4 26.52C24.2267 25.6933 24.64 24.6667 24.64 23.44C24.64 22.2133 24.2267 21.1867 23.4 20.36C22.5733 19.5333 21.5467 19.12 20.32 19.12C19.0933 19.12 18.0667 19.5333 17.24 20.36C16.4133 21.1867 16 22.2133 16 23.44C16 24.6667 16.4133 25.6933 17.24 26.52C18.0667 27.3467 19.0933 27.76 20.32 27.76ZM32 37.04C28.4267 37.04 25.1867 38.04 22.28 40.04C19.3733 42.04 17.2267 44.6933 15.84 48L20.08 48C21.2533 45.76 22.92 44.0267 25.08 42.8C27.24 41.5733 29.5733 40.96 32.08 40.96C34.5867 40.96 36.8933 41.5733 39 42.8C41.1067 44.0267 42.7733 45.76 44 48L48.16 48C46.8267 44.6933 44.6933 42.04 41.76 40.04C38.8267 38.04 35.5733 37.04 32 37.04ZM32 64C27.6267 64 23.4933 63.16 19.6 61.48C15.7067 59.8 12.3067 57.5067 9.4 54.6C6.49333 51.6933 4.2 48.2933 2.52 44.4C0.84 40.5067 0 36.3467 0 31.92C0 27.5467 0.84 23.4133 2.52 19.52C4.2 15.6267 6.49333 12.24 9.4 9.36C12.3067 6.48 15.7067 4.2 19.6 2.52C23.4933 0.84 27.6533 0 32.08 0C36.4533 0 40.5867 0.84 44.48 2.52C48.3733 4.2 51.76 6.48 54.64 9.36C57.52 12.24 59.8 15.6267 61.48 19.52C63.16 23.4133 64 27.5733 64 32C64 36.3733 63.16 40.5067 61.48 44.4C59.8 48.2933 57.52 51.6933 54.64 54.6C51.76 57.5067 48.3733 59.8 44.48 61.48C40.5867 63.16 36.4267 64 32 64ZM32 59.2C39.5733 59.2 46 56.5467 51.28 51.24C56.56 45.9333 59.2 39.52 59.2 32C59.2 24.4267 56.56 18 51.28 12.72C46 7.44 39.5733 4.8 32 4.8C24.48 4.8 18.0667 7.44 12.76 12.72C7.45333 18 4.8 24.4267 4.8 32C4.8 39.52 7.45333 45.9333 12.76 51.24C18.0667 56.5467 24.48 59.2 32 59.2Z" fill="var(--check-fragile-icon)" fill-rule="nonzero" opacity="1" stroke="none"/></svg>';
const icon_check_unsafe = '<svg stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" version="1.1" viewBox="0 0 64 64" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M32 37.04C28.4267 37.04 25.1867 38.04 22.28 40.04C19.3733 42.04 17.2267 44.6933 15.84 48L48.16 48C46.8267 44.6933 44.6933 42.04 41.76 40.04C38.8267 38.04 35.5733 37.04 32 37.04ZM17.36 31.28L21.36 27.68L24.96 31.28L27.44 28.4L23.84 24.8L27.44 21.2L24.96 18.32L21.36 21.92L17.36 18.32L14.88 21.2L18.48 24.8L14.88 28.4L17.36 31.28ZM39.12 31.28L42.64 27.68L46.72 31.28L49.2 28.4L45.6 24.8L49.2 21.2L46.72 18.32L42.64 21.92L39.12 18.32L36.64 21.2L40.16 24.8L36.64 28.4L39.12 31.28ZM32 64C27.6267 64 23.4933 63.16 19.6 61.48C15.7067 59.8 12.3067 57.5067 9.4 54.6C6.49333 51.6933 4.2 48.2933 2.52 44.4C0.84 40.5067 0 36.3733 0 32C0 27.5733 0.84 23.4133 2.52 19.52C4.2 15.6267 6.49333 12.24 9.4 9.36C12.3067 6.48 15.7067 4.2 19.6 2.52C23.4933 0.84 27.6267 0 32 0C36.4267 0 40.5867 0.84 44.48 2.52C48.3733 4.2 51.76 6.48 54.64 9.36C57.52 12.24 59.8 15.6267 61.48 19.52C63.16 23.4133 64 27.5733 64 32C64 36.3733 63.16 40.5067 61.48 44.4C59.8 48.2933 57.52 51.6933 54.64 54.6C51.76 57.5067 48.3733 59.8 44.48 61.48C40.5867 63.16 36.4267 64 32 64ZM32 59.2C39.5733 59.2 46 56.5467 51.28 51.24C56.56 45.9333 59.2 39.52 59.2 32C59.2 24.4267 56.56 18 51.28 12.72C46 7.44 39.5733 4.8 32 4.8C24.48 4.8 18.0667 7.44 12.76 12.72C7.45333 18 4.8 24.4267 4.8 32C4.8 39.52 7.45333 45.9333 12.76 51.24C18.0667 56.5467 24.48 59.2 32 59.2Z" fill="var(--check-unsafe-icon)" fill-rule="nonzero" opacity="1" stroke="none"/></svg>';
const icon_regular_expression = `<svg stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" version="1.1" viewBox="0 0 64 64" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M0 32.0221C0 28.0684 0.712175 24.2862 2.13653 20.6756C3.56093 17.065 5.57452 13.7706 8.17728 10.7924C8.53982 10.3607 8.99085 10.1223 9.53037 10.0769C10.0699 10.0316 10.5383 10.1967 10.9353 10.5722C11.3324 10.9693 11.5115 11.443 11.4727 11.9934C11.4338 12.5436 11.2223 13.0519 10.8382 13.5181C8.57646 16.0992 6.84131 18.9652 5.63271 22.1161C4.42411 25.267 3.81981 28.5582 3.81981 31.9897C3.81981 35.4083 4.44678 38.6704 5.70071 41.7759C6.9546 44.8815 8.68436 47.753 10.89 50.3902C11.2526 50.8564 11.464 51.3733 11.5245 51.9409C11.5849 52.5084 11.4166 52.9908 11.0195 53.3879C10.6224 53.7849 10.1401 53.964 9.57245 53.9252C9.00488 53.8864 8.53982 53.6512 8.17728 53.2195C5.60903 50.2413 3.60408 46.9436 2.16245 43.3265C0.720817 39.7094 0 35.9413 0 32.0221ZM23.5993 50.8499C22.5936 50.8499 21.7433 50.5024 21.0485 49.8074C20.3535 49.1126 20.006 48.2623 20.006 47.2566C20.006 46.2509 20.3535 45.4006 21.0485 44.7057C21.7433 44.0107 22.5936 43.6632 23.5993 43.6632C24.605 43.6632 25.4553 44.0107 26.1502 44.7057C26.8452 45.4006 27.1926 46.2509 27.1926 47.2566C27.1926 48.2623 26.8452 49.1126 26.1502 49.8074C25.4553 50.5024 24.605 50.8499 23.5993 50.8499ZM38.6654 34.0162C38.1086 34.0162 37.6511 33.8371 37.2929 33.4788C36.9346 33.1206 36.7555 32.6631 36.7555 32.1063L36.7555 26.9137L32.3658 29.5359C31.878 29.8078 31.3838 29.8812 30.8832 29.756C30.3825 29.6308 30.007 29.3244 29.7566 28.8367C29.4847 28.3705 29.4113 27.8871 29.5365 27.3864C29.6617 26.8857 29.9681 26.5102 30.4558 26.2599L34.8456 23.6895L30.404 21.119C29.9163 20.8687 29.6185 20.4932 29.5106 19.9925C29.4027 19.4918 29.4847 18.9976 29.7566 18.5099C30.007 18.0437 30.3825 17.7481 30.8832 17.6229C31.3838 17.4978 31.878 17.5884 32.3658 17.8948L36.7555 20.4652L36.7555 15.2726C36.7555 14.7158 36.9346 14.2583 37.2929 13.9001C37.6511 13.5418 38.1086 13.3627 38.6654 13.3627C39.2223 13.3627 39.6798 13.5418 40.038 13.9001C40.3963 14.2583 40.5754 14.7158 40.5754 15.2726L40.5754 20.4652L44.9975 17.843C45.4637 17.5711 45.9471 17.4978 46.4477 17.6229C46.9484 17.7481 47.3239 18.0437 47.5743 18.5099C47.8462 18.9976 47.9196 19.4918 47.7944 19.9925C47.6692 20.4932 47.3736 20.8687 46.9075 21.119L42.4853 23.6895L46.9592 26.2599C47.4254 26.5102 47.7124 26.8857 47.8203 27.3864C47.9282 27.8871 47.8462 28.3705 47.5743 28.8367C47.3239 29.3244 46.9484 29.6308 46.4477 29.756C45.9471 29.8812 45.4637 29.7905 44.9975 29.4841L40.5754 26.9137L40.5754 32.1063C40.5754 32.6631 40.3963 33.1206 40.038 33.4788C39.6798 33.8371 39.2223 34.0162 38.6654 34.0162ZM64 32.0221C64 35.9758 63.2878 39.758 61.8634 43.3686C60.439 46.9792 58.4254 50.2629 55.8227 53.2195C55.4601 53.6512 55.0091 53.8864 54.4695 53.9252C53.93 53.964 53.4617 53.7849 53.0646 53.3879C52.6675 52.9908 52.4798 52.517 52.5014 51.9667C52.523 51.4164 52.715 50.9082 53.0776 50.442C55.3264 47.8608 57.0723 45.0034 58.3154 41.8698C59.5586 38.7362 60.1801 35.4428 60.1801 31.9897C60.1801 28.5582 59.5532 25.2724 58.2993 22.1323C57.0453 18.9922 55.3156 16.1208 53.11 13.5181C52.7474 13.0519 52.5499 12.5436 52.5175 11.9934C52.4851 11.443 52.6675 10.9693 53.0646 10.5722C53.4617 10.1967 53.93 10.0316 54.4695 10.0769C55.0091 10.1223 55.4601 10.3607 55.8227 10.7924C58.3909 13.7922 60.3958 17.092 61.8375 20.6918C63.2792 24.2916 64 28.0684 64 32.0221Z" fill-rule="nonzero" opacity="1" stroke="none"/></svg>`;
const icon_more_options = `<svg stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" version="1.1" viewBox="0 0 64 64" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M14.8894 36C16.0031 36 16.9467 35.6102 17.72 34.8306C18.4933 34.051 18.88 33.1043 18.88 31.9906C18.88 30.8769 18.4902 29.9333 17.7106 29.16C16.931 28.3867 15.9843 28 14.8706 28C13.7569 28 12.8133 28.3898 12.04 29.1694C11.2667 29.949 10.88 30.8957 10.88 32.0094C10.88 33.1231 11.2698 34.0667 12.0494 34.84C12.829 35.6133 13.7757 36 14.8894 36ZM32.0094 36C33.1231 36 34.0667 35.6102 34.84 34.8306C35.6133 34.051 36 33.1043 36 31.9906C36 30.8769 35.6102 29.9333 34.8306 29.16C34.051 28.3867 33.1043 28 31.9906 28C30.8769 28 29.9333 28.3898 29.16 29.1694C28.3867 29.949 28 30.8957 28 32.0094C28 33.1231 28.3898 34.0667 29.1694 34.84C29.949 35.6133 30.8957 36 32.0094 36ZM49.0494 36C50.1631 36 51.1067 35.6102 51.88 34.8306C52.6533 34.051 53.04 33.1043 53.04 31.9906C53.04 30.8769 52.6502 29.9333 51.8706 29.16C51.091 28.3867 50.1443 28 49.0306 28C47.9169 28 46.9733 28.3898 46.2 29.1694C45.4267 29.949 45.04 30.8957 45.04 32.0094C45.04 33.1231 45.4298 34.0667 46.2094 34.84C46.989 35.6133 47.9357 36 49.0494 36ZM32.0213 64C27.6088 64 23.4621 63.16 19.5813 61.48C15.7004 59.8 12.3067 57.5067 9.4 54.6C6.49333 51.6933 4.2 48.2976 2.52 44.4127C0.84 40.5279 7.10543e-15 36.377 7.10543e-15 31.96C7.10543e-15 27.543 0.84 23.3921 2.52 19.5073C4.2 15.6224 6.49333 12.24 9.4 9.36C12.3067 6.48 15.7024 4.2 19.5873 2.52C23.4721 0.84 27.623 0 32.04 0C36.457 0 40.6079 0.84 44.4927 2.52C48.3776 4.2 51.76 6.48 54.64 9.36C57.52 12.24 59.8 15.6267 61.48 19.52C63.16 23.4133 64 27.5662 64 31.9787C64 36.3912 63.16 40.5379 61.48 44.4187C59.8 48.2996 57.52 51.6884 54.64 54.5853C51.76 57.4821 48.3733 59.7755 44.48 61.4653C40.5867 63.1551 36.4338 64 32.0213 64ZM32.04 59.2C39.5867 59.2 46 56.5467 51.28 51.24C56.56 45.9333 59.2 39.5067 59.2 31.96C59.2 24.4133 56.565 18 51.295 12.72C46.025 7.44 39.5933 4.8 32 4.8C24.48 4.8 18.0667 7.43499 12.76 12.705C7.45333 17.975 4.8 24.4067 4.8 32C4.8 39.52 7.45333 45.9333 12.76 51.24C18.0667 56.5467 24.4933 59.2 32.04 59.2Z" fill-rule="nonzero" opacity="1" stroke="none" /></svg>`;
const icon_edit = `<svg stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" version="1.1" viewBox="0 0 64 64" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M58.8056 15.0257L48.96 5.18031L52.952 1.1884C53.7537 0.386661 54.7619-0.00454017 55.9765 0.0147986C57.1912 0.0340745 58.2115 0.45667 59.0374 1.28259L62.7974 5.04262C63.5991 5.84436 64 6.84291 64 8.03827C64 9.23363 63.5871 10.2442 62.7612 11.0701L58.8056 15.0257ZM2.71678 63.9859C1.92464 63.9859 1.27381 63.7311 0.764288 63.2215C0.254763 62.712 0 62.0611 0 61.269L0 55.2343C0 54.8817 0.0627881 54.5545 0.188364 54.2526C0.313941 53.9507 0.521612 53.6428 0.81138 53.3289L45.9825 8.19405L55.7917 18.0033L10.6569 63.1744C10.343 63.4642 10.035 63.6719 9.73316 63.7975C9.43134 63.9231 9.10412 63.9859 8.7515 63.9859L2.71678 63.9859Z" fill-rule="nonzero" opacity="1" stroke="none" /></svg>`;
const icon_delete = ` <svg stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" version="1.1" viewBox="0 0 64 64" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M12.8875 64C11.3969 64 10.113 63.4615 9.03605 62.3845C7.95906 61.3075 7.42056 60.0236 7.42056 58.5329L7.42056 6.96125L5.72206 6.96125C5.11161 6.96125 4.60062 6.75382 4.18911 6.33895C3.77753 5.92409 3.57174 5.409 3.57174 4.79368C3.57174 4.17831 3.77753 3.66893 4.18911 3.26557C4.60062 2.86226 5.11161 2.66061 5.72206 2.66061L19.7831 2.66061C19.7831 1.91225 20.0435 1.28174 20.5644 0.769082C21.0853 0.256361 21.7117 0 22.4437 0L41.5563 0C42.2882 0 42.9147 0.260435 43.4356 0.781306C43.9565 1.30224 44.2169 1.92867 44.2169 2.66061L58.2779 2.66061C58.8884 2.66061 59.3994 2.86804 59.8109 3.28291C60.2225 3.69771 60.4283 4.2128 60.4283 4.82818C60.4283 5.44356 60.2225 5.9529 59.8109 6.3562C59.3994 6.75957 58.8884 6.96125 58.2779 6.96125L56.5794 6.96125L56.5794 58.5329C56.5794 60.0236 56.0409 61.3075 54.964 62.3845C53.887 63.4615 52.6031 64 51.1125 64L12.8875 64ZM52.2789 6.96125L11.7211 6.96125L11.7211 58.5329C11.7211 58.8731 11.8365 59.1526 12.0674 59.3713C12.2983 59.59 12.5717 59.6994 12.8875 59.6994L51.1125 59.6994C51.4283 59.6994 51.7017 59.59 51.9326 59.3713C52.1635 59.1526 52.2789 58.8731 52.2789 58.5329L52.2789 6.96125ZM22.6406 51.6957L26.9412 51.6957L26.9412 14.8701L22.6406 14.8701L22.6406 51.6957ZM37.0588 51.6957L41.3594 51.6957L41.3594 14.8701L37.0588 14.8701L37.0588 51.6957ZM11.7211 6.96125L11.7211 59.6994L11.7211 6.96125Z" fill-rule="nonzero" opacity="1" stroke="none" /></svg>`;
const icon_share = `<svg stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" version="1.1" viewBox="0 0 64 64" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M12.9615 63.9998C11.729 63.9998 10.6653 63.5525 9.77055 62.6577C8.87577 61.763 8.42838 60.6993 8.42838 59.4668L8.42838 22.8584C8.42838 21.626 8.87577 20.5624 9.77055 19.6676C10.6653 18.7728 11.729 18.3254 12.9615 18.3254L22.0394 18.3254C22.5456 18.3254 22.9693 18.4974 23.3105 18.8414C23.6517 19.1854 23.8223 19.6125 23.8223 20.1227C23.8223 20.6329 23.6517 21.0553 23.3105 21.3897C22.9693 21.7241 22.5456 21.8914 22.0394 21.8914L12.9615 21.8914C12.7197 21.8914 12.498 21.9921 12.2965 22.1935C12.095 22.3951 11.9943 22.6167 11.9943 22.8584L11.9943 59.4668C11.9943 59.7086 12.095 59.9303 12.2965 60.1318C12.498 60.3333 12.7197 60.434 12.9615 60.434L51.0385 60.434C51.2803 60.434 51.502 60.3333 51.7035 60.1318C51.905 59.9303 52.0057 59.7086 52.0057 59.4668L52.0057 22.8584C52.0057 22.6167 51.905 22.3951 51.7035 22.1935C51.502 21.9921 51.2803 21.8914 51.0385 21.8914L41.8639 21.8914C41.3577 21.8914 40.934 21.7194 40.5927 21.3754C40.2515 21.0314 40.0809 20.6043 40.0809 20.0941C40.0809 19.5838 40.2515 19.1615 40.5927 18.8271C40.934 18.4927 41.3577 18.3254 41.8639 18.3254L51.0385 18.3254C52.271 18.3254 53.3347 18.7728 54.2295 19.6676C55.1242 20.5624 55.5716 21.626 55.5716 22.8584L55.5716 59.4668C55.5716 60.6994 55.1242 61.763 54.2295 62.6577C53.3347 63.5526 52.271 64 51.0385 64L12.9615 64L12.9615 63.9998ZM30.1687 5.99554L24.2092 11.9248C23.8789 12.2753 23.4699 12.4556 22.9823 12.4657C22.4948 12.4758 22.0655 12.2955 21.6945 11.9248C21.3443 11.5742 21.1692 11.1522 21.1692 10.6586C21.1692 10.165 21.3545 9.73283 21.7252 9.36213L30.3621 0.676901C30.8115 0.225634 31.3359 0 31.9352 0C32.5344 0 33.0698 0.225634 33.5412 0.676901L42.2264 9.36213C42.577 9.71267 42.7573 10.1359 42.7674 10.6317C42.7775 11.1275 42.6074 11.5465 42.2571 11.8888C41.8633 12.2512 41.4262 12.4324 40.9458 12.4324C40.4653 12.4324 40.038 12.2471 39.6639 11.8764L33.7346 5.99554L33.7346 39.4553C33.7346 39.9614 33.5626 40.3851 33.2187 40.7263C32.8747 41.0675 32.4475 41.2381 31.9373 41.2381C31.4271 41.2381 31.0048 41.0675 30.6703 40.7263C30.3359 40.3851 30.1687 39.9614 30.1687 39.4553L30.1687 5.99554Z" fill-rule="nonzero" opacity="1" stroke="none"/></svg>`;
const icon_tick = `<svg stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" version="1.1" viewBox="0 0 64 64" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M18.6667 32L24.8889 25.7778C25.4222 25.2444 25.6889 24.5926 25.6889 23.8222C25.6889 23.0519 25.4222 22.4 24.8889 21.8667C24.3556 21.3333 23.7087 21.0667 22.9482 21.0667C22.1876 21.0667 21.5308 21.3333 20.9778 21.8667L12.7111 30.1333C12.4148 30.4296 12.2074 30.7299 12.0889 31.034C11.9704 31.3383 11.9111 31.6642 11.9111 32.0118C11.9111 32.3595 11.9704 32.6815 12.0889 32.9778C12.2074 33.2741 12.4148 33.5704 12.7111 33.8667L21.0667 42.2222C21.6197 42.7556 22.2765 43.0222 23.0371 43.0222C23.7975 43.0222 24.4444 42.7556 24.9778 42.2222C25.5111 41.6889 25.7778 41.037 25.7778 40.2667C25.7778 39.4963 25.5111 38.8444 24.9778 38.3111L18.6667 32ZM45.3333 32L39.0222 38.3111C38.4889 38.8444 38.2222 39.4963 38.2222 40.2667C38.2222 41.037 38.4889 41.6889 39.0222 42.2222C39.5556 42.7556 40.2025 43.0222 40.9629 43.0222C41.7235 43.0222 42.3803 42.7556 42.9333 42.2222L51.2889 33.8667C51.5852 33.5704 51.7926 33.2701 51.9111 32.966C52.0296 32.6617 52.0889 32.3358 52.0889 31.9882C52.0889 31.6405 52.0296 31.3185 51.9111 31.0222C51.7926 30.7259 51.5852 30.4296 51.2889 30.1333L42.9333 21.7778C42.6963 21.4815 42.4 21.2741 42.0444 21.1556C41.6889 21.037 41.3333 20.9778 40.9778 20.9778C40.6222 20.9778 40.2815 21.037 39.9556 21.1556C39.6296 21.2741 39.3284 21.4756 39.0518 21.76C38.4988 22.3289 38.2222 22.9926 38.2222 23.7511C38.2222 24.5096 38.4889 25.1556 39.0222 25.6889L45.3333 32ZM5.33333 64C3.91111 64 2.66667 63.4667 1.6 62.4C0.533333 61.3333 0 60.0889 0 58.6667L0 5.33333C0 3.91111 0.533333 2.66667 1.6 1.6C2.66667 0.533333 3.91111 0 5.33333 0L58.6667 0C60.0889 0 61.3333 0.533333 62.4 1.6C63.4667 2.66667 64 3.91111 64 5.33333L64 58.6667C64 60.0889 63.4667 61.3333 62.4 62.4C61.3333 63.4667 60.0889 64 58.6667 64L5.33333 64ZM5.33333 58.6667L58.6667 58.6667L58.6667 5.33333L5.33333 5.33333L5.33333 58.6667ZM5.33333 5.33333L5.33333 58.6667L5.33333 5.33333Z" fill-rule="nonzero" opacity="1" stroke="none" /></svg>`
const icon_add = `<svg stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" version="1.1" viewBox="0 0 64 64" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M31.98 64C31.0029 64 30.1905 63.6714 29.5429 63.0143C28.8952 62.3571 28.5714 61.5429 28.5714 60.5714L28.5714 35.4286L3.42857 35.4286C2.45714 35.4286 1.64286 35.0981 0.985714 34.4371C0.328571 33.7761 0 32.9571 0 31.98C0 31.0029 0.328571 30.1905 0.985714 29.5429C1.64286 28.8952 2.45714 28.5714 3.42857 28.5714L28.5714 28.5714L28.5714 3.42857C28.5714 2.45714 28.9019 1.64286 29.5629 0.985714C30.2239 0.328571 31.0429 0 32.02 0C32.9971 0 33.8095 0.328571 34.4571 0.985714C35.1048 1.64286 35.4286 2.45714 35.4286 3.42857L35.4286 28.5714L60.5714 28.5714C61.5429 28.5714 62.3571 28.9019 63.0143 29.5629C63.6714 30.2239 64 31.0429 64 32.02C64 32.9971 63.6714 33.8095 63.0143 34.4571C62.3571 35.1048 61.5429 35.4286 60.5714 35.4286L35.4286 35.4286L35.4286 60.5714C35.4286 61.5429 35.0981 62.3571 34.4371 63.0143C33.7761 63.6714 32.9571 64 31.98 64Z" fill-rule="nonzero" opacity="1" stroke="none" /></svg>`
const icon_save = `<svg stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" version="1.1" viewBox="0 0 64 64" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M6.80548 64C4.90379 64 3.29413 63.3412 1.97648 62.0235C0.658825 60.7059 0 59.0962 0 57.1945L0 6.80548C0 4.90379 0.658825 3.29413 1.97648 1.97648C3.29413 0.658825 4.90379 0 6.80548 0L47.2109 0C48.1182 0 48.9906 0.176189 49.828 0.528566C50.6655 0.880881 51.3931 1.36593 52.0109 1.98372L62.0163 11.9891C62.6341 12.6069 63.1191 13.3345 63.4714 14.172C63.8238 15.0094 64 15.8818 64 16.7891L64 57.1945C64 59.0962 63.3412 60.7059 62.0235 62.0235C60.7059 63.3412 59.0962 64 57.1945 64L6.80548 64ZM58.353 16.3764L47.6236 5.64698L6.80548 5.64698C6.4676 5.64698 6.19004 5.75559 5.97282 5.97282C5.75559 6.19004 5.64698 6.4676 5.64698 6.80548L5.64698 57.1945C5.64698 57.5324 5.75559 57.81 5.97282 58.0272C6.19004 58.2444 6.4676 58.353 6.80548 58.353L57.1945 58.353C57.5324 58.353 57.81 58.2444 58.0272 58.0272C58.2444 57.81 58.353 57.5324 58.353 57.1945C58.353 57.1945 58.353 16.3764 58.353 16.3764ZM32 51.837C34.6063 51.837 36.8265 50.9199 38.6605 49.0859C40.4946 47.2518 41.4117 45.0316 41.4117 42.4253C41.4117 39.819 40.4946 37.5988 38.6605 35.7647C36.8265 33.9307 34.6063 33.0137 32 33.0137C29.3937 33.0137 27.1735 33.9307 25.3395 35.7647C23.5054 37.5988 22.5883 39.819 22.5883 42.4253C22.5883 45.0316 23.5054 47.2518 25.3395 49.0859C27.1735 50.9199 29.3937 51.837 32 51.837ZM14.2624 24.0361L38.3709 24.0361C39.3411 24.0361 40.1508 23.7115 40.7999 23.0624C41.4491 22.4132 41.7737 21.6036 41.7737 20.6335L41.7737 14.2624C41.7737 13.2923 41.4491 12.4827 40.7999 11.8335C40.1508 11.1844 39.3411 10.8598 38.3709 10.8598L14.2624 10.8598C13.2923 10.8598 12.4827 11.1844 11.8335 11.8335C11.1844 12.4827 10.8598 13.2923 10.8598 14.2624L10.8598 20.6335C10.8598 21.6036 11.1844 22.4132 11.8335 23.0624C12.4827 23.7115 13.2923 24.0361 14.2624 24.0361ZM5.64698 16.3764L5.64698 58.353L5.64698 5.64698L5.64698 16.3764Z" fill-rule="nonzero" opacity="1" stroke="none"/></svg>`


window.icons = {
  icon_arrow,
  icon_copy,
  icon_date,
  icon_text,
  icon_hashtag,
  icon_password,
  icon_check_strong,
  icon_check_passable,
  icon_check_fragile,
  icon_check_unsafe,
  icon_regular_expression,
  icon_more_options,
  icon_edit,
  icon_delete,
  icon_share,
  icon_tick,
  icon_add,
  icon_save
};

export default window.icons;
