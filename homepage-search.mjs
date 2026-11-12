const fold=value=>String(value??'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase();

export function filterDiscoveries({places,online},{mode='places',query='',city='all',category='all'}={}){
  const terms=fold(query).trim().split(/\s+/).filter(Boolean);
  return (mode==='online'?online:places).filter(place=>{
    const categories=category==='language'?['language','schools']:category==='recipes'?['recipes','restaurants','groceries']:[category];
    if(category!=='all'&&!categories.includes(place.category))return false;
    if(mode!=='online'&&city!=='all'&&![place.city,place.city_group,place.county].includes(city))return false;
    const haystack=fold([place.name,place.korean,place.city,place.city_group,place.county,place.category,place.address,place.summary,...(place.tags||[])].join(' '));
    return terms.every(term=>haystack.includes(term));
  });
}
