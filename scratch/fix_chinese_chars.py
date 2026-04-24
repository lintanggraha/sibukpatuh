import json
import re

REPLACEMENTS = {
    '公平': ' adil ',
    '疫苗': 'vaksin',
    '演习': 'latihan',
    '体检': 'pemeriksaan kesehatan',
    '救出': 'selamatkan',
    '指标': 'indikator',
    '有些': 'beberapa',
    '一': '',
    '二': '',
    '三': '',
    '四': '',
    '五': '',
    '六': '',
    '七': '',
    '八': '',
    '九': '',
    '十': '',
    '中': '',
    '文': '',
    '国': '',
    '这': '',
    '那': '',
    '个': '',
    '来': '',
    '很': '',
    '容': '',
    '易': '',
    '很': '',
    '容': '',
    '易': '',
    '很': '',
    '容': '',
    '易': '',
    '很': '',
    '容': '',
    '易': '',
    '很容易': 'mudah',
    'langganan': 'berhenti langganan',
    '继续': 'terus',
    '读完': 'dibaca',
    'fine': 'rinci',
    '手': 'tangan',
    '服务': 'servis',
    '韩国': 'Korea',
    '日本': 'Jepang',
    '中国': 'Cina',
    '台湾': 'Taiwan',
    '香港': 'Hong Kong',
    '新加坡': 'Singapura',
    '马来西亚': 'Malaysia',
    '泰国': 'Thailand',
    '菲律宾': 'Filipina',
    '印度尼西亚': 'Indonesia',
    '澳大利亚': 'Australia',
    '新西兰': 'Selandia Baru',
    '加拿大': 'Kanada',
    '美国': 'Amerika Serikat',
    '英国': 'Inggris',
    '法国': 'Prancis',
    '德国': 'Jerman',
    '意大利': 'Italia',
    '西班牙': 'Spanyol',
    '葡萄牙': 'Portugal',
    '俄罗斯': 'Rusia',
    '乌克兰': 'Ukraina',
    '波兰': 'Polandia',
    '荷兰': 'Belanda',
    '比利时': 'Belgia',
    '瑞士': 'Swiss',
    '奥地利': 'Austria',
    '瑞典': 'Swedia',
    '挪威': 'Norwegia',
    '丹麦': 'Denmark',
    '芬兰': 'Finlandia',
    '希腊': 'Yunani',
    '土耳其': 'Turki',
    '以色列': 'Israel',
    '沙特阿拉伯': 'Arab Saudi',
    '阿联酋': 'UEA',
    '卡塔尔': 'Qatar',
    '科威特': 'Kuwait',
    '巴林': 'Bahrain',
    '阿曼': 'Oman',
    '约旦': 'Yordania',
    '黎巴嫩': 'Lebanon',
    '叙利亚': 'Suriah',
    '伊拉克': 'Irak',
    '伊朗': 'Iran',
    '巴基斯坦': 'Pakistan',
    '阿富汗': 'Afghanistan',
    '哈萨克斯坦': 'Kazakhstan',
    '乌兹别克斯坦': 'Uzbekistan',
    '土库曼斯坦': 'Turkmenistan',
    '吉尔吉斯斯坦': 'Kirgistan',
    '塔吉克斯坦': 'Tajikistan',
    '孟加拉国': 'Bangladesh',
    '斯里兰卡': 'Sri Lanka',
    '尼泊尔': 'Nepal',
    '不丹': 'Bhutan',
    '缅甸': 'Myanmar',
    '泰国': 'Thailand',
    '柬埔寨': 'Kamboja',
    '老挝': 'Laos',
    '越南': 'Vietnam',
    '菲律宾': 'Filipina',
    '文莱': 'Brunei',
    '东帝汶': 'Timor Leste',
    '马尔代夫': 'Maladewa',
}

def clean_text(text):
    if not text:
        return text
    
    result = text
    for old, new in REPLACEMENTS.items():
        result = result.replace(old, new)
    
    # Remove any remaining Chinese characters (CJK Unified Ideographs)
    result = re.sub(r'[\u4e00-\u9fff]', '', result)
    
    # Clean up double spaces
    result = re.sub(r'\s+', ' ', result)
    result = result.strip()
    
    return result

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    updated = 0
    if isinstance(data, list):
        for item in data:
            if 'analogy' in item and item['analogy']:
                original = item['analogy']
                cleaned = clean_text(original)
                if cleaned != original:
                    item['analogy'] = cleaned
                    updated += 1
            if 'summary' in item and item['summary']:
                item['summary'] = clean_text(item['summary'])
            if 'title' in item and item['title']:
                item['title'] = clean_text(item['title'])
    elif isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, str):
                cleaned = clean_text(value)
                if cleaned != value:
                    data[key] = cleaned
                    updated += 1
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    return updated

def main():
    files = [
        'public/data/padg_requirements.json',
        'public/data/padg_appendices.json',
        'public/data/pbi_022024_requirements.json',
        'public/data/uu_pdp_requirements.json',
        'public/data/seojk_requirements.json',
        'public/data/nist_csf.json',
        'public/data/iso27001.json',
    ]
    
    for filepath in files:
        try:
            updated = process_file(filepath)
            if updated > 0:
                print(f"Updated {updated} items in {filepath}")
        except Exception as e:
            print(f"Error processing {filepath}: {e}")

if __name__ == '__main__':
    main()