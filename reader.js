(() => {
  'use strict';
  const root = document.getElementById('nk-supper');
  if (!root) return;
  const body = root.querySelector('.nk-body');
  const levels = root.querySelector('.nk-levels');
  const status = root.querySelector('[role="status"]');
  const languages = root.querySelector('.nk-languages');
  const pair = (ko, en) => ({ ko, en });
  const assets = {
    pork: 'assets/magazine/jeyuk.webp', pan: 'assets/magazine/in-the-pan.webp', ssam: 'assets/magazine/ssam.webp',
    ricecakes: 'assets/magazine/tteokbokki.webp', cover: 'assets/gochujang/cover.webp',
    family: 'assets/gochujang/editor-family.webp', yuja: 'assets/gochujang/yuja-preserve.webp', grandmother: 'assets/magazine/grandmother.webp',
    hanbok: 'assets/magazine/chang-eungbok-hanbok.webp', bibimbap: 'assets/magazine/bibimbap.webp'
  };
  const text = {
    levelFirst: pair('초급 · 첫 한 숟갈', 'First taste · Sauces'), levelSupper: pair('2단계 · 저녁 한 끼', 'Level 2 · Supper'),
    levelsLabel: pair('요리 단계', 'Cookery level'), recipes: pair('고추장 활용편', 'Cooking with gochujang'),
    supperTitle: pair(['오늘 저녁은', '고추장으로'], ['Gochujang', 'for supper']),
    supperDeck: pair('영국 마트에서 산 돼지 어깨살로 제육 한 팬을 볶아요. 밥 위에 소복하게 올릴까요, 상추에 한입씩 싸 먹을까요?', 'Pick up a pack of pork shoulder and make one pan of jeyuk. Spoon it over rice or fold it into little lettuce wraps.'),
    comingSoon: pair('Coming soon · 공개 예정', 'Coming soon'),
    supperSoonDeck: pair('제육볶음 레시피를 준비하고 있어요. 지금은 제육 상추쌈과 떡볶이를 펼쳐 보세요.', 'Our jeyuk bokkeum recipe is coming soon. You can read the pork lettuce wrap and tteokbokki recipes now.'),
    firstTitle: pair(['처음 맛보는', '고추장 한 숟갈'], ['Your first spoonful', 'of gochujang']),
    firstDeck: pair('따뜻한 밥 한 그릇에 고추장을 조금 넣고 비벼 보세요.', 'Start with a bowl of warm rice and a spoonful of gochujang.'),
    read: pair('제육볶음 펼치기', 'Make jeyuk bokkeum'),
    photo: pair('완성 요리 이미지는 AI로 제작했습니다.', 'AI-generated cooking illustrations.'),
    firstPhotoCredit: pair('비빔밥은 편집자의 집밥 사진이에요. 소고기 볶음고추장은 직접 만들어 촬영할 예정이에요.', 'The bibimbap is from our editor’s kitchen. Her photo of the beef gochujang will follow.'),
    pantry: pair('준비할 재료', 'What to have ready'), steps: pair('이렇게 해봐요', 'At the stove'),
    firstSteps: pair('이렇게 먹어봐요', 'How to try it'),
    tips: pair('우리 집 팁', 'Tips from my kitchen'),
    firstBack: pair('초급 요리 목차', 'First taste contents'), supperBack: pair('2단계 요리 목차', 'Level 2 contents'),
    next: pair('다음 요리', 'Next dish'), sources: pair('참고한 레시피', 'Recipe references'),
    question: pair('엄마들에게 묻고 싶은 한 가지', 'A question for our mums'),
    margin: pair('조리 메모', 'Cook’s note'),
    imgUnavailable: pair('이 사진을 표시할 수 없어요. 아래에서 요리를 계속 읽을 수 있어요.', 'The photograph is unavailable. You can still read the dish below.'),
    photoPending: pair('편집자가 직접 촬영할 사진 자리', 'Space for the editor’s own photograph'),
    thumbnailMissing: pair('사진을 불러오지 못했어요.', 'Photo unavailable.')
  };
  const dishes = {
    pork: {
      comingSoon: true,
      title: pair('제육볶음', 'Spicy pork stir-fry'), name: pair('Jeyuk bokkeum', '제육볶음 · Jeyuk bokkeum'),
      technique: pair('팬에 볶기', 'Stir-fry'), summary: pair('얇게 썬 돼지 어깨살과 양파를 볶아요. 양념이 고기에 착 붙으면 따뜻한 밥 위에 올려요.', 'Thin slices of pork shoulder and soft onion catch the red seasoning in the pan. Spoon them over warm rice.'),
      cover: 'pork', image: 'pan', alt: pair('양파와 함께 볶아 흰 접시에 담은 붉은 제육볶음', 'Thin slices of red-seasoned pork and onion on an off-white plate'),
      articleAlt: pair('나무주걱으로 돼지고기를 한쪽으로 밀어 철팬 바닥이 드러난 모습', 'A wooden spatula pushes the glazed pork aside, leaving a stripe of iron pan visible'),
      caption: pair('주걱이 지나간 자리에 묽은 양념이 거의 고이지 않아요. 조리 장면 AI 예시.', 'The spatula leaves a clear trail as the sauce clings to the pork. AI-generated cooking study.'),
      ingredients: pair(['얇게 썬 돼지 어깨살', '양파와 대파', '고추장·간장·마늘', '설탕 조금, 참기름', '곁들일 밥'], ['Thinly sliced pork shoulder', 'Onion and spring onion', 'Gochujang, soy sauce and garlic', 'A little sugar and sesame oil', 'Cooked rice, to serve']),
      method: pair(['돼지 어깨살을 결 반대로 얇게 썰어요. 고추장에 간장, 다진 마늘, 설탕 조금과 참기름을 섞어 고기에 버무려요.', '달군 팬에 고기와 양파를 얇게 펼쳐 볶아요. 팬이 작으면 두 번에 나눠 볶으면 물기가 덜 생겨요.', '고기를 속까지 익혀요. 양념이 고기에 달라붙으면 대파를 넣고 한 번 뒤적여요. 밥 위에 담거나 상추와 함께 내요.'], ['Slice the pork shoulder steaks thinly across the grain. Mix the gochujang, soy sauce, garlic, a little sugar and sesame oil, then coat the pork.', 'Spread the pork and onion across a hot frying pan. Cook in batches if the pan is small so the slices have room to fry.', 'Stir until the pork is cooked through and the sauce clings to the slices. Fold in the spring onion. Serve over rice or alongside lettuce leaves.']),
      question: pair('“제육은 미리 재워두세요, 팬에서 바로 양념하세요?”', '“Do you marinate the pork first or season it straight in the pan?”'),
      references: [['Korean Bapsang', 'https://www.koreanbapsang.com/dweji-bulgogi-korean-spicy-pork-bbq/'], ['Maangchi', 'https://www.maangchi.com/recipe/dwaejigogi-bokkeum']]
    },
    ssam: {
      title: pair('제육 상추쌈', 'Pork lettuce wraps'), name: pair('Jeyuk ssam', '제육쌈 · Jeyuk ssam'),
      technique: pair('같은 제육, 한입 쌈', 'From the same pan'), summary: pair('제육볶음 한 팬을 식탁 가운데 놓아요. 상추 한 장에 밥과 고기를 조금씩 올려 각자 한입을 싸요.', 'Put the pan of jeyuk in the middle of the table. Everyone can tuck a little rice and pork into their own lettuce leaf.'),
      cover: 'ssam', image: 'ssam', alt: pair('펼친 상추 한 장에 흰밥 조금과 붉게 볶은 돼지고기를 올린 한입 쌈', 'An open lettuce leaf with a spoonful of rice and two slices of gochujang pork'),
      caption: pair('잎 가장자리는 접을 수 있게 비워둬요. 한입 크기를 보여주는 AI 예시.', 'Leave the edges free so the leaf folds over the filling. AI-generated serving study.'),
      ingredients: pair(['미리 볶아 둔 제육', '부드러운 상추 잎', '따뜻한 밥'], ['Cooked spicy pork', 'Soft lettuce leaves', 'Warm rice']),
      method: pair(['상추를 씻어 물기를 털고 한 장씩 떼어 놓아요.', '잎 한가운데 밥을 조금 놓고, 제육 한두 점과 함께 볶은 양파를 얹어요.', '잎 가장자리를 안으로 모아 한입에 먹어요. 두 번째 쌈은 내 입맛에 맞게 밥과 고기의 양을 바꿔 보세요.'], ['Wash and dry the lettuce, then separate the leaves.', 'Set a little rice in the middle of a leaf. Add a slice or two of cooked pork and some onion from the pan.', 'Fold the edges in and eat the parcel in one bite. Adjust the balance of rice and pork on the next leaf.']),
      note: pair('처음엔 속을 조금만 담아보세요. 밥과 고기를 더 넣는 건 다음 쌈에도 할 수 있어요.', 'Start with a small filling so the leaf closes easily. There is always the next wrap.'),
      references: [['Korean Bapsang', 'https://www.koreanbapsang.com/dweji-bulgogi-korean-spicy-pork-bbq/']]
    },
    ricecakes: {
      title: pair('떡볶이', 'Saucy rice cakes'), name: pair('Tteokbokki', '떡볶이 · Tteokbokki'),
      technique: pair('양념 졸이기', 'Reduce the sauce'), summary: pair('처음엔 국물처럼 묽어요. 떡을 저어가며 끓이면 붉은 소스가 표면에 윤기 있게 감겨요.', 'The sauce starts thin. As the rice cakes soften and you stir, it thickens into a glossy red coating.'),
      cover: 'ricecakes', image: 'ricecakes', alt: pair('흰 접시 위에 짧고 둥근 쌀떡이 붉은 양념에 고루 싸여 있다', 'Short cylindrical rice cakes coated in glossy red sauce on an off-white dish'),
      caption: pair('떡 사이로 소스가 조금 흐를 정도로 졸여요. 완성 요리 AI 예시.', 'Leave enough sauce to pool between the rice cakes. AI-generated serving study.'),
      ingredients: pair(['떡볶이용 떡', '멸치·다시마 육수', '고추장과 설탕', '대파, 취향에 따라 고춧가루'], ['Cylindrical rice cakes', 'Anchovy and kelp stock', 'Gochujang and sugar', 'Spring onion and optional Korean chilli flakes']),
      method: pair(['떡이 서로 붙었다면 낱개로 떼어요. 냉동 떡은 포장에 적힌 준비 방법을 따라요.', '육수에 고추장과 설탕을 풀고 떡을 넣어 끓여요. 더 맵게 먹고 싶다면 고춧가루를 조금 더해요.', '바닥에 붙지 않게 저어요. 떡이 부드럽고 양념이 윤기 있게 감기면 대파를 더해 따뜻할 때 먹어요.'], ['Separate any rice cakes that are stuck together. Follow the pack instructions if yours are frozen.', 'Dissolve gochujang and sugar in the stock. Bring the rice cakes to a simmer, adding chilli flakes if you like more heat.', 'Stir to keep the rice cakes from sticking. Finish with spring onion once they are tender and the sauce coats them.']),
      note: pair(
        '조청이 없어도 괜찮아요. 망치의 떡볶이는 설탕으로 단맛을 내요. 비건 떡볶이에는 다시마와 말린 표고버섯으로 우린 육수를 써요. 떡과 고추장도 비건용으로 골라요.',
        'A spoonful of sugar gives Maangchi’s version its sweetness. You can leave rice syrup on the shelf. For vegan tteokbokki, make the stock with just kelp and dried shiitake mushrooms, and choose vegan rice cakes and gochujang.'
      ),
      references: [['Maangchi', 'https://www.maangchi.com/recipe/tteokbokki']]
    },
    bap: {
      title: pair('다진 소고기와 남은 채소, 반숙 달걀프라이로 만드는 비빔밥', 'Bibimbap with beef mince, leftover veg and a runny fried egg'),
      name: pair('Bibimbap', '비빔밥'), technique: pair('비빔밥 소스 · 엄마의 반찬', 'Bibimbap sauce · Mum’s Banchan'),
      summary: pair('고추장과 다진 소고기만 있으면 집에서 언제든 해 먹을 수 있는 든든한 탄단지 한 그릇밥이에요. 김치처럼 밥에 곁들이는 반찬(side dishes)이 있으면 같이 비벼 보세요.',
        'When I’ve got gochujang and beef mince, I can always make this at home. Rice, beef, egg and a little sesame oil give me carbs, protein and fat in one filling bowl. Kimchi is one of the banchan (Korean side dishes) you can mix in.'),
      image: 'bibimbap', portrait: true,
      alt: pair('파란 꽃무늬 그릇에 다진 소고기와 채소, 김치를 담고 달걀프라이와 고추장을 올린 비빔밥', 'A blue floral bowl of bibimbap with beef mince, vegetables and kimchi, topped with a fried egg and a spoonful of gochujang'),
      caption: pair('고추장을 막 올린, 비비기 전의 한 그릇. 사진은 편집자의 집밥이에요.', 'Just before mixing, with the gochujang spooned over the egg. From the editor’s kitchen.'),
      ingredients: pair(['참기름', '고추장'], ['Sesame oil', 'Gochujang']),
      method: pair([
        '당근과 양파는 조금씩 잘게 썰어 기름 두른 팬에 살짝 볶아요.',
        '신김치가 있으면 물에 헹궈 물기를 꼭 짜요. 참기름을 몇 방울 떨어뜨리고 손으로 살살 조물조물 무쳐요.',
        '달걀프라이는 꼭 반숙으로 부쳐요. 흰자는 익히고 노른자는 비빌 때 흐를 만큼 부드럽게 두세요.',
        '따뜻한 밥에 미리 익혀 둔 다진 소고기와 볶은 채소를 담아요. 무친 신김치가 있으면 함께 넣고 달걀프라이를 올려요. 고추장 조금과 참기름 몇 방울을 더하고 노른자를 톡 터뜨려 비벼요.'
      ], [
        'Finely chop a little carrot and onion and soften them in a frying pan with a little oil.',
        'If you have sour kimchi, rinse it and squeeze it dry. Gently work a few drops of sesame oil into it with your fingers.',
        'Fry the egg until the white is set. Keep the yolk runny so it coats the rice when you mix it in.',
        'Spoon the cooked beef mince and veg over warm rice. Add the dressed kimchi if you’re using it, then lay the egg on top. Add a dab of gochujang and a few drops of sesame oil. Break the yolk and mix everything together.'
      ]),
      tips: pair([
        '저는 스시용 쌀이나 한국 쌀로 지은 밥을 좋아해요. 찰기가 있어서 고기랑 채소를 비벼도 한 숟갈 뜨면 한입에 쏙 들어가요.',
        '채소는 냉장고에 남은 걸 그때그때 써요. 파프리카나 파슬리는 다 비비고 나면 향이 도드라져서 저는 잘 넣지 않아요. 숙주를 쪄서 넣어도 맛있어요. 이것저것 비벼 보면서 나만의 채소 조합을 찾아보세요.'
      ], [
        'I like sushi rice or Korean short-grain rice for bibimbap. The grains cling together, so it’s easy to get a little rice, beef and veg in one spoonful.',
        'I use whatever veg is left in the fridge. I usually leave out sweet peppers and parsley because their flavours can take over once everything is mixed. Steamed mung bean sprouts work well. Try a few combinations and find your favourite.'
      ]),
      noteLabel: pair('Coming soon', 'Coming soon'),
      note: pair('우리 집 다진 소고기 만드는 법', 'How I prepare the beef mince')
    },
    paste: {
      title: pair('소고기 볶음고추장', 'Stir-fried gochujang with beef mince'),
      name: pair('소고기 약고추장', '소고기 약고추장 · Yakgochujang'),
      technique: pair('팬에 볶기 · 영상 레시피', 'In the frying pan · Video recipe'),
      summary: pair(
        '다진 소고기를 먼저 데친 다음 파와 마늘, 고추장에 볶아요. 따뜻한 밥에 한 숟갈 얹어 비벼 보세요.',
        'Blanch the beef mince first, then fry it with spring onion, garlic and gochujang. Stir a spoonful through a bowl of warm rice.'
      ),
      portrait: true,
      short: {id: 'uzvfR7Yt4cc', creator: '쿡경희'},
      ingredients: pair([
        '다진 소고기 300g', '고추장 400g', '양파 100g, 대파 50g, 다진 마늘 2큰술',
        '양조간장 1큰술, 맛술(미림) 2큰술, 매실청 2큰술', '식용유 1큰술, 참기름 1큰술, 후추 ½작은술',
        '선택 · 생강가루 ½작은술', '선택 · 참깨 2큰술'
      ], [
        '300 g beef mince', '400 g gochujang', '100 g onion, 50 g spring onion and 2 tbsp finely chopped garlic',
        '1 tbsp brewed soy sauce, 2 tbsp mirin and 2 tbsp Korean plum syrup (maesil-cheong)',
        '1 tbsp vegetable oil, 1 tbsp sesame oil and ½ tsp ground black pepper',
        'Optional · ½ tsp ground ginger', 'Optional · 2 tbsp sesame seeds'
      ]),
      method: pair([
        '끓는 물에 다진 소고기를 풀어 넣고 2분 데쳐요. 체에 밭쳐 찬물로 헹군 뒤 물기를 빼요.',
        '양파와 대파를 잘게 썰어요. 팬에 식용유를 두르고 양파, 대파, 마늘을 1분쯤 볶아요. 데친 소고기를 넣고 간장, 맛술, 매실청, 후추를 더해 1분 더 볶아요. 생강 향을 좋아하면 이때 생강가루를 넣으세요.',
        '고추장을 넣고 바닥에 눋지 않게 저으며 3분 정도 볶아요. 참기름을 섞고 2분쯤 더 볶아 고기를 속까지 익혀요.',
        '불을 끄면 완성이에요. 참깨를 좋아하면 이때 뿌려요. 밥에 조금씩 비비거나 상추쌈에 얹어 보세요.'
      ], [
        'Break up the mince in a pan of boiling water. After 2 minutes, tip it into a sieve, rinse under cold water and leave to drain.',
        'Finely chop both onions. Soften them with the garlic in the vegetable oil for about a minute. Add the mince, soy sauce, mirin, plum syrup and pepper. If you like ginger, add it now. Stir for another minute.',
        'Stir in the gochujang and cook for about 3 minutes, stirring to keep it from catching. Stir in the sesame oil and cook for about 2 minutes more, until the beef is cooked through.',
        'Take the pan off the heat. Scatter over the sesame seeds if you like, then serve a little with rice or tuck it into a lettuce wrap.'
      ]),
      noteLabel: pair('매거진에서 조정한 재료', 'Our version'),
      note: pair('쿡경희의 원본에서 올리고당을 생략하고 매실청으로 단맛을 냈어요. 생강가루와 참깨는 취향껏 넣으세요.',
        'We keep the plum syrup from the original recipe and leave out the oligosaccharide syrup. The ground ginger and sesame seeds are up to you.')
    }
  };
  const order = {supper: ['pork','ssam','ricecakes'], first: ['bap','paste']};
  const cultureEpisodes = [
    {page:'onggi', title:pair('옹기','Onggi'), description:pair(
      '장과 김치를 익히고 보관하는 전통 흙항아리',
      'Korean earthenware jars for fermenting and storing food'
    )},
    {page:'chang-eungbok', title:pair('한국 섬유, 장응복','Korean textiles with Chang Eungbok')},
    {page:'do-ho-suh', title:pair('서도호','Do Ho Suh')}
  ];
  const sectionNames = ['magazine','letter','issue','shop','recipes','artists',...cultureEpisodes.map(episode=>episode.page)];
  const startingPage = root.dataset.start === 'recipes' ? 'recipes' : 'magazine';
  const valid = input => {
    const language = input?.language === 'ko' ? 'ko' : 'en';
    const page = sectionNames.includes(input?.page) ? input.page : input?.level ? 'recipes' : startingPage;
    const level = input?.level === 'first' ? 'first' : 'supper';
    const dish = page === 'recipes' && order[level].includes(input?.dish) ? input.dish : null;
    return {language, page, level, dish};
  };
  function fromHash() {
    const [language, where, dish] = location.hash.slice(1).split('/');
    if (Object.hasOwn(order,where)) {
      const recipe = valid({language,page:'recipes',level:where,dish});
      if (dish && !recipe.dish) {
        history.replaceState(history.state,'','#' + [recipe.language, recipe.level].join('/'));
      }
      return recipe;
    }
    return valid({language,page:where});
  }
  let state = fromHash();
  let exhibitionTimer;
  const t = value => value[state.language];
  function el(tag, className, label) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (label != null) node.textContent = label;
    return node;
  }
  function button(className, label, action, value) {
    const node = el('button', className, label);
    node.type = 'button';
    node.dataset[action] = value;
    return node;
  }
  function arrow() {
    const n = el('span','nk-arrow','→');
    n.setAttribute('aria-hidden','true');
    return n;
  }
  function img(key, alt, unavailable = t(text.imgUnavailable)) {
    const photo = el('img');
    photo.alt = alt;
    photo.src = assets[key];
    photo.decoding = 'async';
    photo.addEventListener('error', () => {
      const msg = el('span','nk-photo-missing',unavailable);
      photo.replaceWith(msg);
    }, {once:true});
    return photo;
  }
  function caseTitle(words) {
    const h = el('h1');
    words.forEach((word,i) => {
      if (i) h.append(' ');
      h.append(el('span','',word));
    });
    return h;
  }
  function heading(title, deck) {
    const head = el('header','nk-heading');
    head.append(caseTitle(t(title)),el('p','nk-deck',t(deck)));
    return head;
  }
  function youtubePlayer(id, title) {
    const player = el('iframe');
    player.title = title;
    player.referrerPolicy = 'strict-origin-when-cross-origin';
    player.allow = 'encrypted-media; fullscreen; picture-in-picture';
    player.allowFullscreen = true;
    player.src = 'https://www.youtube-nocookie.com/embed/' + id + '?playsinline=1';
    return player;
  }
  function photoBlock(className, photo, caption) {
    const f = el('figure',className);
    f.append(photo, el('figcaption','',caption));
    return f;
  }
  const front = {
    contents: pair('매거진 목차', 'Magazine contents'),
    letter: pair('편집자의 편지', 'Editor’s letter'),
    title: pair('내가 먹고 자란 맛', 'The flavours I grew up with'),
    subtitle: pair('The flavours I grew up with', '내가 먹고 자란 맛'),
    opening: pair(
      '어릴 때 우리 집에선 쌀도, 고춧가루도, 참기름도, 김치도 사 먹은 적이 없었다면 믿으시겠어요?',
      'Would you believe that when I was a child, our family never bought rice, gochugaru (Korean chilli flakes), sesame oil or kimchi?'
    ),
    fromHome: pair(
      '쌀은 정미소에서 받아 먹었고, 고추장과 김치는 외할머니와 친할머니가 담가 보내 주셨어요.',
      'Our rice came from the mill, and my two grandmothers sent us the gochujang and kimchi they made.'
    ),
    familyTable: pair(
      '저는 한국에서 태어나 40년을 살았어요. 도시가 빠르게 커지던 제 어린 시절에도 우리 집 밥상에는 할머니가 손수 농사지어 햇살에 말려 보내 주신 것들이 올랐어요. 돌이켜보면 참 운이 좋았어요. 그렇게 먹고 자란 손주 세대로는 저희가 거의 마지막이었나 싶어요.',
      'I was born in Korea and lived there for forty years. The cities were growing fast when I was a child. My grandmother still sent us food she’d grown herself and dried in the sun. Looking back, I wonder if we were among the last grandchildren lucky enough to grow up eating that way.'
    ),
    twoGochujangs: pair(
      '두 할머니의 고추장은 색부터 달랐어요. 하나는 덜 달고 묵직했고, 다른 하나는 조금 상큼했어요.',
      'Even the colours of my grandmothers’ gochujang were different. One had a deep flavour and was less sweet. The other tasted a little brighter.'
    ),
    learningJang: pair(
      '할머니가 장을 담그실 때마다 저도 가르쳐 달라고 했어요. 그러면 할머니는 이런 쓸데없는 거 배우지 말고 공부나 하라고 하셨어요.',
      'Whenever my grandmother made jang, the fermented sauces and pastes we ate at home, I’d ask her to show me how. She’d say there was no use learning a thing like that and tell me to get on with my schoolwork.'
    ),
    returnToJang: pair(
      '근데 아직도 장이 궁금해서 다시 여기로 돌아왔어요.',
      'I still want to know how she made it. That’s what’s brought me back to jang.'
    ),
    inBritain: pair(
      '지금은 영국에서 한국의 발효 음식을 하나씩 알아가며 어릴 때 먹던 그 맛을 찾고 있어요.',
      'Here in Britain, I’m learning about the fermented foods I grew up with and looking for those familiar flavours.'
    ),
    familyAlt: pair('수박과 과일이 차려진 생일상 앞에 앉아 있는 어린 시절의 나', 'Me as a child at my birthday table, with a carved watermelon and other fruit in the foreground'),
    familyCaption: pair('내 어린시절 생일잔치', 'My childhood birthday party'),
    grandmotherAlt: pair('한복을 입은 외할머니의 흑백 초상사진', 'A black-and-white portrait of my maternal grandmother wearing hanbok'),
    grandmotherCaption: pair('우리 외할머니', 'My maternal grandmother'),
    yuja: pair('돌아가신 할머니가 담가주신 마지막 유자청', 'The last batch of yuja preserve my late grandmother made for me'),
    yujaMemory: pair(
      '저는 아직도 이 유자청과 고추장, 된장의 맛으로 할머니를 기억해요. 햇볕에 직접 말렸던 고춧가루의 눈부신 붉은빛으로도요. 그 맛과 빛깔을 따라, 제가 먹고 자란 음식을 다시 찾아가고 있어요.',
      'I still remember my grandmother through the taste of this yuja preserve, her gochujang and her doenjang. I see her, too, in the brilliant red of gochugaru made from sun-dried chillies. Those tastes and colours are guiding me back to the food I grew up with.'
    ),
    familyKitchen: pair(
      '영국에서도 한국에서 해 먹던 방식을 최대한 살려 한 끼를 차려요. 여기서 구할 수 있는 재료로 만든 음식 가운데 우리 식구가 제일 잘 먹었던 것부터 소개할게요.',
      'Here in Britain, I cook as closely as I can to the way we did at home in Korea. I’ll start with the dishes my whole family has enjoyed most and show you how I make them with what I can find here.'
    ),
    familyTraditions: pair(
      '두 할머니의 고추장 맛이 달랐듯, 집집마다 대를 이어 온 레시피가 있어요. 엄마마다 유난히 잘하는 반찬도 다르고요. 그 반찬을 어떻게 만드는지, 누구에게 배웠는지 한 집씩 이곳에 담아볼게요.',
      'Each of my grandmothers made gochujang her own way. Every family has recipes it passes down, and every mum has a side dish she’s known for. I’ll share how they make those dishes and who taught them, one family at a time.'
    ),
    letterClosing: pair(
      '어릴 때 집 부엌을 드나들며 먹었던 음식 중엔 ‘이건 나만 아는 맛이야’ 싶은 게 있어요. 한국에서 그렇게 자란 분이라면 저마다 떠오르는 음식이 하나쯤 있을 거예요. 저는 그 맛들을 여러분과 나누고 싶어요.',
      'Some of the flavours I remember from childhood feel like mine alone. If you grew up wandering in and out of the family kitchen in Korea, I wonder which dish comes to mind for you. Those are the flavours I’d love to share.'
    ),
    artists: pair('한국 사람들의 솜씨', 'By Korean Hands'),
    ingredient: pair('식재료 노트 1호', 'Ingredient notes · Issue 01'), kitchen: pair('집집의 레시피', 'Family kitchens'),
    shop: pair('영국 장보기', 'At the British supermarket'),
    shopTitle: pair('제육볶음용 돼지 어깨살', 'Pork shoulder for a stir-fry'),
    shopSummary: pair('영국 마트에서는 pork shoulder steaks라고 적힌 팩을 찾아보세요. 집에서 결 반대로 얇게 썰면 제육볶음에 쓰기 좋아요.', 'Look for a pack labelled pork shoulder steaks. Slice the steaks thinly across the grain at home, ready for jeyuk or another stir-fry.')
  };
  function readButton(label, action, value) {
    const b = button('nk-read',null,action,value);
    b.append(el('span','nk-read-label',label),arrow());
    return b;
  }
  function external(label, href) {
    const link = el('a','nk-outside',label+' ↗');
    link.href=href;
    if (link.origin !== location.origin) { link.target='_blank'; link.rel='noopener noreferrer'; }
    return link;
  }
  function updateExhibitionLinks() {
    clearTimeout(exhibitionTimer);
    const now = Date.now();
    let nextUpdate = Infinity;
    for (const link of body.querySelectorAll('a[data-withdraw-at]')) {
      const remaining = Date.parse(link.dataset.withdrawAt) - now;
      if (remaining > 0) nextUpdate = Math.min(nextUpdate, remaining);
      else link.remove();
    }
    if (Number.isFinite(nextUpdate)) {
      // Browser timers can only wait about 25 days at a time.
      exhibitionTimer = setTimeout(updateExhibitionLinks, Math.min(nextUpdate, 2_147_483_647));
    }
  }
  function magazineHome() {
    const opening=el('section','nk-opening');
    const title=el('header','nk-opening-title');
    title.append(el('p','nk-label',t(front.letter)),el('h1','',t(front.title)),el('p','nk-subtitle',t(front.subtitle)));
    const lead=el('div','nk-opening-copy');
    lead.append(el('p','nk-letter-lede',t(front.opening)),readButton(t(pair('편지 이어 읽기','Read the letter')),'page','letter'));
    opening.append(title,photoBlock('nk-opening-photo',img('family',t(front.familyAlt)),t(front.familyCaption)),lead);

    const contents=el('section','nk-front-contents');
    contents.append(el('h2','nk-contents-heading',t(pair('이번에 읽을 이야기','Inside the magazine'))));
    const cols=el('div','nk-desk-contents');
    const ingredient=button('nk-directory-item nk-ingredient-item',null,'page','issue');
    const ingredientCopy=el('span');
    ingredientCopy.append(el('span','nk-label',t(front.ingredient)),el('strong','',t(pair('고추장','Gochujang'))),el('span','nk-entry-summary',t(pair('고르는 법과 집에서 먹는 법','How to choose it and cook with it'))),arrow());
    ingredient.append(img('cover',''),ingredientCopy);
    const issues=el('div','nk-ingredient-notes');
    issues.append(ingredient);
    const upcomingIssues = [
      { label: pair('식재료 노트 2호', 'Ingredient notes · Issue 02'), title: pair('참기름', 'Sesame oil') },
      { label: pair('식재료 노트 3호', 'Ingredient notes · Issue 03'), title: pair('쌈장', 'Ssamjang') }
    ];
    for (const issue of upcomingIssues) {
      const entry = el('div', 'nk-directory-item');
      const status = el('span', 'nk-entry-summary', 'Coming soon');
      status.lang = 'en-GB';
      entry.append(el('span', 'nk-label', t(issue.label)), el('strong', '', t(issue.title)), status);
      issues.append(entry);
    }
    const other=el('div','nk-other-stories');
    const family=el('details','nk-households');
    const summary=el('summary','');
    summary.append(el('span','nk-label',t(front.kitchen)),el('strong','',t(pair('엄마의 반찬 · 아빠의 특별편','Mum’s Banchan & Dad’s special'))));
    const line=el('p','nk-entry-summary',t(pair('밥에 곁들이는 반찬(side dishes) 중에서 엄마의 계란장을 소개할게요. 미역국과 간장돼지고기볶음도 준비하고 있어요. 아빠의 특별편에서는 양념치킨을 소개할 예정이에요.', 'Mum’s soy-marinated eggs are one of the banchan (Korean side dishes) we eat with rice. That recipe is coming soon, along with seaweed soup, soy pork stir-fry and Dad’s yangnyeom chicken.')));
    family.append(summary,readButton(t(dishes.bap.title),'dish','bap'),el('p','nk-entry-summary',t(front.familyKitchen)),el('p','nk-entry-summary',t(front.familyTraditions)),line);
    const shop=button('nk-directory-item',null,'page','shop');
    shop.append(el('span','nk-label',t(front.shop)),el('strong','',t(front.shopTitle)),arrow());
    other.append(family,shop);
    cols.append(issues,other);
    contents.append(cols,external(t(pair('영국의 가게와 사람들 · 지난 기사','Shops and people in Britain · Earlier stories')),'magazine.html#stories-title'));
    body.replaceChildren(opening,contents);
  }
  function letter() {
    const top=el('header','nk-article-top');
    top.append(el('p','nk-label',t(front.letter)),el('h1','',t(front.title)),el('p','nk-subtitle',t(front.subtitle)));
    const story=el('div','nk-full-letter');
    const opening=el('p','nk-letter-lede nk-letter-opening',t(front.opening) + ' ' + t(front.fromHome));
    const grandmother=img('grandmother',t(front.grandmotherAlt));
    grandmother.width=666;
    grandmother.height=659;
    const portrait=photoBlock('nk-letter-portrait',grandmother,t(front.grandmotherCaption));
    const copy=el('div','nk-full-letter-copy');
    copy.append(
      el('p','nk-letter-lede',t(front.familyTable)),
      el('p','nk-letter-lede',t(front.twoGochujangs)),
      el('p','nk-letter-lede',t(front.learningJang))
    );
    const returnParagraph=el('p','nk-letter-lede');
    returnParagraph.append(el('mark','letter-underline',t(front.returnToJang)), ' ' + t(front.inBritain));
    copy.append(returnParagraph);
    const keepsake=photoBlock('nk-keepsake',img('yuja',t(front.yuja)),t(front.yuja));
    keepsake.querySelector('figcaption').append(el('p','nk-keepsake-note',t(front.yujaMemory)));
    copy.append(keepsake);
    copy.append(el('p','nk-letter-lede nk-letter-kitchen',t(front.familyKitchen)));
    copy.append(el('p','nk-letter-lede',t(front.familyTraditions)));
    copy.append(el('p','nk-letter-lede',t(front.letterClosing)));
    copy.append(photoBlock('nk-letter-family-album',img('family',t(front.familyAlt)),t(front.familyCaption)));
    copy.append(document.createElement('editor-greeting'));
    story.append(opening,portrait,copy);
    body.replaceChildren(top,story,readButton(t(front.contents),'page','magazine'));
  }
  function episodeNumber(index) {
    return t(pair((index+1)+'화','Episode '+(index+1)));
  }
  function cultureSeries() {
    const top=el('header','nk-article-top nk-art-heading');
    const alternateLanguage=state.language==='ko'?'en':'ko';
    const translation=el('p','nk-subtitle',front.artists[alternateLanguage]);
    translation.lang=alternateLanguage==='en'?'en-GB':'ko';
    top.append(el('p','nk-label',t(pair('문화 특집호','Culture special issue'))),el('h1','',t(front.artists)),translation);
    const contents=el('ol','nk-culture-list');
    cultureEpisodes.forEach((episode,index)=>{
      const item=el('li');
      const link=readButton(episodeNumber(index)+' · '+t(episode.title),'page',episode.page);
      item.append(link);
      if (episode.description) {
        const description=el('span','nk-episode-description',t(episode.description));
        description.id=episode.page+'-description';
        link.setAttribute('aria-describedby',description.id);
        item.append(description);
      }
      contents.append(item);
    });
    body.replaceChildren(top,contents);
  }
  function onggiChapter() {
    const story=el('section','nk-onggi');
    story.append(
      el('p','nk-deck',t(pair(
        '제가 어릴 때 강진은 시골이었어요. 마을에서 옹기를 빚었고, 제가 먹고 자란 쌀이며 배추, 감, 고춧가루도 모두 그곳에서 났어요.',
        'The Gangjin I remember from childhood was a rural place. People made earthenware jars in the village. The rice, cabbages, persimmons and gochugaru (Korean chilli flakes) I grew up eating came from there too.'
      ))),
      el('p','nk-deck',t(pair(
        '할머니는 그 옹기에 장을 담가 익히셨어요. 지금도 옹기를 보면 할머니가 독에서 국간장을 떠다 쓰시던 모습이 떠올라요.',
        'My grandmother would leave her jang, her homemade sauces and pastes, to mature in those jars. I still remember her ladling gukganjang, Korean soup soy sauce, straight from the jar.'
      )))
    );
    const film=el('figure','nk-onggi-film');
    const player=youtubePlayer('q2k-MIPPTGA',t(pair('국가유산청 · 정윤석 옹기장의 작업 과정','Korea Heritage Service · Jeong Yoon-seok making onggi in Gangjin')));
    const credit=el('figcaption');
    credit.append(el('span','',t(pair('전남 강진의 정윤석 옹기장', 'Jeong Yoon-seok, an onggi potter in Gangjin, South Korea'))), ' · ', external(t(pair('국가유산청 영상', 'Film by the Korea Heritage Service')),'https://www.youtube.com/watch?v=q2k-MIPPTGA'));
    film.append(player,credit);
    story.append(film,el('p','',t(pair('빚어 놓은 독을 가마 안에 차곡차곡 들이는 장면이 나와요. 이 일을 옹기장들은 ‘재임’이라고 불러요.','Watch how the finished jars are stacked inside the kiln before firing. The potters call this part of the work jaeim.'))),
      el('h2','',t(pair('장을 담는 독, 독을 놓는 자리','The jar and its place in the household'))),
      el('p','',t(pair('옹기는 흙을 빚어 구운 생활 그릇이에요. 장독에는 간장·된장·고추장을, 김칫독에는 김치를 담아 익히고 보관했어요. 쌀을 담아 두는 쌀독도, 떡을 찌는 시루도 있었어요. 장독들을 모아 놓은 자리가 장독대예요.',
      'Onggi are earthenware vessels made for everyday life. Families kept soy sauce, doenjang and gochujang in jars called jangdok, and fermented kimchi in its own crock. Some vessels held rice, while perforated steamers were used to make rice cakes. The place set aside for the jang jars was the jangdokdae.'))),
      external(t(pair('한국민족문화대백과사전 〈옹기〉','Onggi in the Encyclopedia of Korean Culture')),'https://encykorea.aks.ac.kr/Article/E0038898'));
    const fermentation=el('section','nk-jang');
    fermentation.append(
      el('h2','',t(pair('왜 장은 옹기에 담갔을까요?', 'Why did families keep jang in earthenware jars?'))),
      el('p','',t(pair(
        '간장과 된장은 한 독에서 시작해요. 메주를 소금물에 담가 두었다가 때가 되면 장을 갈라요. 국물은 간장이 되고, 건져낸 메주는 으깨서 된장이 돼요. 그렇게 가른 장을 각각 독에 담아 더 익히고, 밥상을 차릴 때마다 조금씩 덜어 썼어요.',
        'Soy sauce and doenjang, Korean soybean paste, start in the same jar. Families soaked blocks of fermented soybeans, called meju, in brine. Later they drew off the liquid for soy sauce and mashed the softened beans for doenjang. Each went back into its own jar to mature, ready to be dipped into whenever the family cooked.'
      ))),
      el('p','',t(pair(
        '옹기가 ‘숨을 쉰다’는 말을 들어보셨나요? 구운 흙벽에는 아주 작은 틈이 남아 기체가 통하고 수분이 조금씩 빠져나갈 수 있어요. 유약을 어떻게 입혔느냐에 따라 그 정도도 달라져요.',
        'Potters sometimes say that onggi breathe. Tiny pores in the fired clay let gases pass through and moisture escape. How much escapes depends in part on how the potter glazes the jar.'
      ))),
      el('p','',t(pair(
        '한 연구에서는 메주와 멸치액젓으로 담근 간장을 세 종류의 옹기에서 넉 달 동안 익혔어요. 안팎에 유약을 바른 독에서는 겉에만 바른 독이나 유약을 바르지 않은 독보다 물이 덜 줄었어요. 콩 단백질을 잘게 나누는 효소도 그 독에서 더 활발했고, 시식한 사람들은 그 간장의 향에 가장 높은 점수를 줬어요.',
        'In one study, researchers made soy sauce with meju and anchovy sauce and aged it for four months in three kinds of onggi. The jar glazed on both sides lost less water than the unglazed jar or the one glazed only on the outside. The enzymes that break down soybean protein were more active in that jar too, and the tasting panel scored its aroma highest.'
      ))),
      external(t(pair('간장을 세 가지 옹기에 담아 본 연구 (2006)', 'The soy sauce and glaze study (2006)')), 'https://doi.org/10.1111/j.1365-2621.2006.01161.x')
    );
    story.append(fermentation);
    story.append(el('h2','',t(pair('영국에서 만나는 옹기','Onggi in Britain'))),
      el('p','',t(pair('영국에서도 옛 옹기의 모습을 살펴볼 수 있어요. 더럼대학교 오리엔탈 박물관의 한국관 안내서에서 ‘Onggi jars’를 찾으면 사진과 함께 무엇을 담았는지 읽을 수 있어요.',
        'In the guide to Durham University’s Rutt Gallery of Korea, look up “Onggi jars” to see the vessels and read what families kept in them.'))),
      external(t(pair('더럼대학교 한국관 안내서 · PDF','Durham University gallery guide · PDF')),'https://www.durham.ac.uk/things-to-do/media/things-to-do/oriental-museum/visit/access/downloadable-gallery-guides-/Rutt-Gallery-of-Korea---Large-Print-Guide.pdf'),
      el('p','',t(pair('집에 둘 독의 크기가 궁금하다면 예산옹기의 4리터 장독을 보세요. 가장 넓은 곳이 23cm이고 높이는 21cm예요. 아트인코 영국 페이지에서 주문할 수 있고, 한국에서 발송하며 배송비는 주소에 따라 계산해요.',
        'For a sense of scale, a four-litre jar by Yesan Onggi measures 23 cm across at its widest point and 21 cm high. ArtinKo lists it on its UK shop and ships from South Korea, with postage worked out at checkout.'))),
      el('p','',t(pair('이 독을 처음 쓸 때는 깨끗한 물로 충분히 헹구고 완전히 말리라는 것이 판매처의 안내예요. 평소에는 통풍이 되는 자리에 두고 급격한 온도 변화를 피해 주세요.',
        'For this particular jar, the seller advises rinsing it well with clean water and drying it completely before first use. Keep it somewhere airy and avoid sudden changes in temperature.'))),
      external(t(pair('예산옹기 4리터 · 영국 주문 및 관리 안내','Yesan Onggi four-litre jar · UK ordering and care')),'https://www.artinko.com/en-gb/collections/birthday-gift/products/traditional-korean-onggi-fermentation-jar-4-l-earthenware-for-soybean-paste-gochujang-and-more'));
    return story;
  }
  function changChapter() {
    const chang=el('article','nk-artist-feature');
    const photograph=img('hanbok',t(pair('보랏빛 고름과 초록 무늬 치마가 보이는 한복을 입고 걸어오는 편집자', 'The editor walking in a hanbok with a purple ribbon and a green-patterned skirt')));
    photograph.width=960; photograph.height=1440;
    const figure=photoBlock('nk-hanbok-photo',photograph,t(pair('장응복의 한복을 입은 편집자. 개인 소장 사진.', 'The editor modelling a hanbok by Chang Eungbok. From the editor’s archive.')));
    const title=el('header','nk-artist-title');
    title.append(el('h2','',t(pair('내가 입었던 한복','The hanbok I wore'))));
    const copy=el('div','nk-artist-copy');
    copy.append(el('p','',t(pair(
      '저는 장응복 선생님의 한복을 입고 모델로 선 적이 있어요. 사진 속 보랏빛 고름은 허리 아래로 길게 내려오고, 흰 치마의 주름 사이로 초록 무늬가 이어져요.',
      'I once modelled a hanbok by Chang Eungbok. In this photograph, the purple ribbon falls past my waist and a green pattern runs through the folds of the white skirt.'
    ))),el('p','',t(pair(
      '장응복은 규방공예와 민예에서 찾은 무늬를 천에 옮기고, 그 무늬로 가구와 방 안의 풍경까지 바꾸는 디자이너예요. 제가 입었던 치마에서 시작해 서울공예박물관 전시로 눈을 돌리면, 한 사람의 무늬를 두 가지 크기로 볼 수 있어요.',
      'Chang draws on Korean domestic needlework and folk art to design patterns for textiles, furniture and interiors. The skirt in this photograph shows how a pattern sits on the body. Her exhibition at the Seoul Museum of Craft Art shows what it can do for a whole room.'
    ))));
    const sources=el('div','nk-artist-sources');
    sources.append(external(t(pair('서울공예박물관 전시 보기','See the Seoul Museum of Craft Art exhibition')),state.language==='ko'?'https://craftmuseum.seoul.go.kr/exhibit/plan/view/194':'https://english.visitseoul.net/exhibition/EQUINOX/ENPq79in8'),
      external(t(pair('키오스크 매거진의 작가 소개','Read the Kiosk Magazine profile')),'https://www.instagram.com/p/De3VPHvmCMT/'),
      external(t(pair('모노콜렉션 인스타그램 · @monocollection','Mono Collection on Instagram · @monocollection')),'https://www.instagram.com/monocollection/'));
    copy.append(sources);
    chang.append(title,figure,copy);
    return chang;
  }
  function suhChapter() {
    const suh=el('article','nk-artist-note');
    const suhTitle=el('header','nk-artist-title');
    suhTitle.append(el('h2','',t(pair('푸른 천으로 지은 서울집 복도','A Seoul hallway in blue cloth'))));
    const suhCopy=el('div','nk-artist-copy');
    suhCopy.append(el('p','',t(pair(
      '서도호는 한때 살았던 집의 복도를 얇은 천으로 꿰매 실제 크기로 옮겼어요. 스미스소니언에서 선보인 〈Hubs〉에는 서로 다른 세 집의 복도가 이어져요. 푸른색을 찾아보세요. 작가가 어린 시절 가족과 살았던 서울집 복도예요.',
      'Do Ho Suh sews full-size passages from homes he once lived in, using translucent fabric. In the Smithsonian’s installation of his Hubs, three homes meet. Look for the blue hallway. It belonged to the house in Seoul where he lived with his family as a child.'
    ))));
    const suhLinks=el('div','nk-artist-sources');
    const koreaExhibition=external(t(pair('영국박물관 〈Korea〉에 전시된 〈자화상〉 (2026–27)','Self-portrait in the British Museum’s Korea exhibition (2026–27)')),'https://www.victoria-miro.com/news/2470');
    // London midnight on the day before the exhibition closes on 31 January.
    koreaExhibition.dataset.withdrawAt='2027-01-30T00:00:00+00:00';
    suhLinks.append(
      external(t(pair('스미스소니언에서 작품 보기','See the work at the Smithsonian')),'https://americanart.si.edu/exhibitions/suh'),
      koreaExhibition,
      external(t(pair('서도호 스튜디오 인스타그램 · @dohosuhstudio','Do Ho Suh Studio on Instagram · @dohosuhstudio')),'https://www.instagram.com/dohosuhstudio/'));
    suhCopy.append(suhLinks);
    suh.append(suhTitle,suhCopy);
    return suh;
  }
  function cultureChapter(index) {
    const chapter=cultureEpisodes[index];
    const head=el('header','nk-article-top nk-art-heading');
    head.append(el('p','nk-label',t(front.artists)+' · '+episodeNumber(index)));
    const title=el('h1','',t(chapter.title));
    if (chapter.description) {
      const heading=el('div','nk-title-with-description');
      heading.append(title,el('p','nk-title-description',t(chapter.description)));
      head.append(heading);
    } else {
      head.append(title);
    }
    const stories={onggi:onggiChapter,'chang-eungbok':changChapter,'do-ho-suh':suhChapter};
    const next=cultureEpisodes[index+1];
    const end=next ? readButton(episodeNumber(index+1)+' · '+t(next.title),'page',next.page)
      : readButton(t(pair('특집 목차로','Back to the special issue')),'page','artists');
    body.replaceChildren(head,stories[chapter.page](),end);
  }
  function ingredientIssue() {
    const item=el('section','nk-issue-intro');
    const cover=img('cover',t(pair('고추장 질감 위에 한글 제목을 얹은 붉은 표지','The red issue cover with the Korean title over a gochujang texture')));
    const copy=el('div');
    copy.append(el('p','nk-label',t(front.ingredient)),el('h1','',t(pair('고추장','Gochujang'))),el('p','nk-deck',t(pair('한 통을 고를 때 무엇을 보고, 집에 가져와서는 어떻게 먹을까요?', 'What should you look for on the label, and what can you make once you get it home?'))));
    const links=el('nav','nk-issue-links');
    links.append(external(t(pair('좋은 고추장 고르는 방법','How to choose a good gochujang')),'gochujang-guide.html'+(state.language==='ko'?'?lang=ko':'')),readButton(t(pair('집에서 처음 맛보기','Your first taste at home')),'level','first'),readButton(t(pair('오늘 저녁은 고추장으로','Gochujang for supper')),'level','supper'));
    copy.append(links);
    item.append(cover,copy);
    body.replaceChildren(item);
  }
  const stockists = [
    {name:'M&S · Ocado', product:'Heritage Gold British Outdoor Bred 4 Pork Shoulder Steaks', pack:'664g', price:'£5.75', unit:'£8.66/kg', url:'https://www.ocado.com/products/m-s-heritage-gold-british-outdoor-bred-4-pork-shoulder-steaks/527842011'},
    {name:'Waitrose', product:'Free Range British Pork 4 Shoulder Steaks', pack:'600g', price:'£5.85', unit:'£9.75/kg', url:'https://www.waitrose.com/ecom/products/waitrose-free-range-british-pork-4-shoulder-steaks/937363-1-2'}
  ];
  function shopping() {
    const top=el('header','nk-article-top');
    top.append(el('p','nk-label',t(front.shop)),el('h1','',t(front.shopTitle)),el('p','nk-deck',t(front.shopSummary)));
    const items=el('div','nk-buy-list');
    for (const s of stockists) {
      const row=el('section','nk-buy-row');
      const identify=el('div');
      identify.append(el('h2','',s.name),external(s.product,s.url));
      const price=el('p','nk-purchase');
      price.append(el('strong','',s.price),el('span','',s.pack+' · '+s.unit));
      row.append(identify,price); items.append(row);
    }
    const checked=el('p','nk-shopping-fine',t(pair('2026년 11월 18일 온라인 단품 표시가. M&S는 Ocado 판매가예요. 고기 150g을 쓰면 약 £1.30–£1.46이고 밥과 양념은 별도예요.', 'Single-pack prices shown online on 18 November 2026. The M&S price is from Ocado. A 150g helping of pork works out at about £1.30–£1.46 before rice or seasoning.')));
    body.replaceChildren(top,items,checked);
    if (dishes.pork.comingSoon) {
      body.append(el('p','nk-release-note',t(dishes.pork.title) + ' · ' + t(text.comingSoon)),readButton(t(text.supperBack),'level','supper'));
    } else {
      body.append(readButton(t(pair('이 부위로 제육볶음 만들기','Use this cut for jeyuk bokkeum')),'dish','pork'));
    }
  }
  function supper() {
    const spread = el('section','nk-spread');
    const dish = dishes.pork;
    let cover = img(dish.cover,t(dish.alt));
    const lead = el('section','nk-feature');
    const label = dish.comingSoon ? text.comingSoon : dish.technique;
    lead.append(el('p','nk-label',t(label)),el('h2','',t(dish.title)),el('p','nk-subtitle',t(dish.name)),el('p','nk-copy',t(dish.summary)));
    if (!dish.comingSoon) {
      const photoButton = button('',null,'dish','pork');
      photoButton.setAttribute('aria-label',t(text.read));
      photoButton.append(cover);
      cover = photoButton;
      lead.append(readButton(t(text.read),'dish','pork'));
    }
    const list = el('div','nk-list');
    for (const key of order.supper.slice(1)) {
      const d = dishes[key];
      const control = button('nk-pick',null,'dish',key);
      const label = el('span');
      label.append(el('span','nk-label',t(d.technique)),el('span','nk-pick-name',t(d.title)));
      control.append(img(d.cover,''),label,arrow());
      list.append(control);
    }
    spread.append(photoBlock('nk-hero',cover,t(text.photo)),lead,list);
    body.replaceChildren(heading(text.supperTitle,dish.comingSoon ? text.supperSoonDeck : text.supperDeck),spread);
  }
  function first() {
    const gallery = el('figure','nk-first-gallery');
    const list = el('ul','nk-first-list');
    for (const key of order.first) {
      const dish = dishes[key];
      const item = el('li');
      const control = button('nk-first-card',null,'dish',key);
      const photo = el('span','nk-first-photo');
      const photoKey = dish.cover || dish.image;
      if (photoKey) {
        photo.append(img(photoKey,t(dish.alt),t(text.thumbnailMissing)));
      } else {
        photo.classList.add('nk-photo-reserved');
        photo.setAttribute('role','img');
        photo.setAttribute('aria-label',t(text.photoPending));
      }
      const copy = el('span','nk-first-copy');
      const title = el('strong','nk-first-title',t(dish.title));
      title.id = 'first-title-' + key;
      control.setAttribute('aria-labelledby',title.id);
      copy.append(el('span','nk-label',t(dish.technique)),title,arrow(),el('span','nk-first-summary',t(dish.summary)));
      control.append(photo,copy);
      item.append(control);
      list.append(item);
    }
    gallery.append(list,el('figcaption','',t(text.firstPhotoCredit)));
    body.replaceChildren(heading(text.firstTitle,text.firstDeck),gallery);
  }
  function listSection(title, items, kind) {
    const section = el('section','nk-chapter');
    const list = el(kind === 'steps' ? 'ol' : 'ul', 'nk-' + kind);
    items.forEach(item => list.append(el('li','',item)));
    section.append(el('h2','',t(title)),list);
    return section;
  }
  function back() {
    return button('nk-linkback','← '+t(state.level==='supper'?text.supperBack:text.firstBack),'level',state.level);
  }
  function article() {
    const d = dishes[state.dish];
    const top = el('header','nk-article-top');
    top.dataset.recipe = state.dish;
    const label = d.comingSoon ? text.comingSoon : d.technique;
    top.append(el('p','nk-label',t(label)),el('h1','',t(d.title)),el('p','nk-subtitle',t(d.name)));
    const inner = el('article');
    inner.append(back());
    if (d.comingSoon) {
      inner.append(top);
      body.replaceChildren(inner);
      return;
    }
    top.append(el('p','nk-deck',t(d.summary)));
    const opening = el('div',d.portrait?'nk-portrait-lead':'');
    opening.append(top);
    if (d.image) opening.append(photoBlock(d.portrait?'nk-portrait':'nk-wide',img(d.image,t(d.articleAlt || d.alt)),t(d.caption)));
    if (d.short) {
      const film = el('figure','nk-short-film');
      const credit = el('figcaption');
      const original = external(t(pair('유튜브에서 원본 보기', 'Watch the original on YouTube')), 'https://www.youtube.com/shorts/' + d.short.id);
      credit.append(d.short.creator + ' · ', original);
      film.append(youtubePlayer(d.short.id, d.short.creator + ' · ' + t(d.title)), credit);
      opening.append(film);
    }
    inner.append(opening);
    const grid = el('div','nk-article-grid');
    grid.append(listSection(text.pantry,t(d.ingredients),'ingredients'),listSection(state.level==='first'?text.firstSteps:text.steps,t(d.method),'steps'));
    inner.append(grid);
    if (d.tips) inner.append(listSection(text.tips, t(d.tips), 'tips'));
    if (state.dish==='pork') {
      const stock=el('aside','nk-shopping-note');
      stock.append(el('p','nk-label',t(front.shop)),el('p','nk-copy',t(pair('고기 팩에는 보통 pork shoulder steaks라고 적혀 있어요.', 'Look for pork shoulder steaks on the label.'))),readButton(t(pair('M&S와 Waitrose에서 고르기','Find the cut at M&S and Waitrose')),'page','shop'));
      inner.append(stock);
    }
    if (d.question || d.note) {
      const note = el('aside','nk-question');
      const label = d.question ? text.question : (d.noteLabel || text.margin);
      note.append(el('p','nk-label',t(label)),el(d.question?'blockquote':'p',d.question?'':'nk-copy',t(d.question || d.note)));
      inner.append(note);
    }
    if (d.references) {
      const sources = el('div','nk-sources');
      sources.append(el('span','',t(text.sources)));
      d.references.forEach(([label,url]) => {
        const a = el('a','',label+' ↗');
        a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer';
        sources.append(a);
      });
      inner.append(sources);
    }
    const nav = el('nav','nk-footnav');
    nav.setAttribute('aria-label',t(pair('이어서 읽기','Continue reading')));
    nav.append(back());
    const list = order[state.level];
    const next = list[list.indexOf(state.dish)+1];
    if (next) nav.append(button('nk-next',t(text.next)+' · '+t(dishes[next].title)+' →','dish',next));
    inner.append(nav);
    body.replaceChildren(inner);
  }
  function updateHomeLink(isCulture) {
    const params = new URLSearchParams(location.search);
    const from = params.get('from');
    const target = new URL('./', document.baseURI);
    if (state.language === 'ko') target.searchParams.set('edition', 'ko');
    if (params.get('book') === '2') target.searchParams.set('book', '2');
    const sections = {family:'family-recipes', shelf:'magazine-shelf', letter:'edit-letter-title'};
    target.hash = isCulture ? 'kn-culture' : (Object.hasOwn(sections, from) ? sections[from] : 'kn-magazine');
    const link = document.getElementById('home-return-link');
    link.href = target.href;
    link.textContent = isCulture ? t(pair('← 홈페이지 문화로','← Back to Culture on the homepage'))
      : from === 'family' ? t(pair('← 홈페이지 우리 집 레시피로','← Back to Family recipes on the homepage'))
      : t(pair('← 홈페이지 매거진으로','← Back to the homepage magazine'));
  }
  function render() {
    root.lang = state.language === 'ko' ? 'ko' : 'en-GB';
    const isRecipes = state.page==='recipes';
    const chapterIndex = cultureEpisodes.findIndex(episode=>episode.page===state.page);
    const isCulture = state.page==='artists' || chapterIndex!==-1;
    root.dataset.section = isCulture ? 'culture' : 'magazine';
    root.querySelector('.nk-issue').textContent = isRecipes ? t(pair('식재료 노트 1호 · 고추장', 'Ingredient notes · Issue 01 · Gochujang')) : 'The Nearby Edit';
    const trail=root.querySelector('.nk-trail');
    trail.replaceChildren();
    if (state.page==='magazine' || isCulture) {
      trail.setAttribute('aria-label',t(pair('섹션','Sections')));
      const magazine=button('nk-linkback',t(pair('매거진','Magazine')),'page','magazine');
      const culture=button('nk-linkback',t(pair('문화','Culture')),'page','artists');
      (isCulture ? culture : magazine).setAttribute('aria-current',chapterIndex===-1?'page':'location');
      trail.append(magazine,culture);
    } else {
      trail.setAttribute('aria-label',t(front.contents));
      trail.append(button('nk-linkback','← '+t(front.contents),'page','magazine'));
      if (isRecipes) trail.append(button('nk-linkback',t(pair('고추장 호','Gochujang issue')),'page','issue'));
    }
    levels.hidden = !isRecipes;
    levels.setAttribute('aria-label',t(text.levelsLabel));
    for (const b of levels.querySelectorAll('button')) {
      b.setAttribute('aria-pressed',String(b.dataset.level===state.level));
      b.textContent = t(b.dataset.level==='first'?text.levelFirst:text.levelSupper);
    }
    languages.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed',String(b.dataset.language===state.language)));
    const edition = root.querySelector('.nk-edition');
    if (isRecipes) edition.textContent = t(text.recipes);
    else if (isCulture) edition.textContent = t(pair('문화 특집','Culture special'));
    else edition.textContent = t(pair('매거진','Magazine'));
    if (state.page==='magazine') magazineHome();
    else if (state.page==='letter') letter();
    else if (state.page==='artists') cultureSeries();
    else if (chapterIndex!==-1) cultureChapter(chapterIndex);
    else if (state.page==='issue') ingredientIssue();
    else if (state.page==='shop') shopping();
    else if (state.dish) article();
    else if (state.level==='supper') supper();
    else first();
    updateExhibitionLinks();
    const title = body.querySelector('h1').textContent;
    document.documentElement.lang = root.lang;
    document.title = title+' · Korea, Nearby';
    updateHomeLink(isCulture);
    status.textContent = title;
  }
  function go(newState) {
    const next = valid(newState);
    if (state.language===next.language && state.page===next.page && state.level===next.level && state.dish===next.dish) return;
    state = next;
    const route = state.page === 'recipes'
      ? [state.language, state.level, state.dish].filter(Boolean).join('/')
      : state.language + '/' + state.page;
    if (location.hash !== '#' + route) {
      const url = new URL(location.href);
      url.hash = route;
      history.pushState(null, '', url);
    }
    render();
    window.scrollTo(0,0);
  }
  root.addEventListener('click',event => {
    const b = event.target.closest('button');
    if (!b || !root.contains(b)) return;
    if (b.dataset.language) go({...state,language:b.dataset.language});
    else if (b.dataset.page) go({...state,page:b.dataset.page,dish:null});
    else if (b.dataset.dish) go({...state,page:'recipes',level:order.first.includes(b.dataset.dish)?'first':'supper',dish:b.dataset.dish});
    else if (b.dataset.level) go({...state,page:'recipes',level:b.dataset.level,dish:null});
    if (!b.isConnected) {
      const focusTo = state.page==='recipes' ? (state.dish ? body.querySelector('.nk-linkback') : levels.querySelector('[aria-pressed="true"]')) : (root.querySelector('.nk-trail [aria-current]') || root.querySelector('.nk-trail button') || body.querySelector('button'));
      if (focusTo) focusTo.focus({preventScroll:true});
    }
  });
  window.addEventListener('popstate',()=>{state=fromHash();render();window.scrollTo(0,0);});
  window.addEventListener('hashchange',()=>{state=fromHash();render();});
  window.addEventListener('pageshow',updateExhibitionLinks);
  document.addEventListener('visibilitychange',updateExhibitionLinks);
  render();
})();
