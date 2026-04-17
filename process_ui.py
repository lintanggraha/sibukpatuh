import re

def process_file(file_path, style_content, prefix):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Replace <style scoped>
    content = re.sub(r'<style scoped>.*?</style>', '<style scoped>\n' + style_content + '\n</style>', content, flags=re.DOTALL)
    
    # 2. Extract <template> and replace prefixes
    template_match = re.search(r'<template>.*?</template>', content, flags=re.DOTALL)
    if template_match:
        template_content = template_match.group(0)
        
        if prefix == 'cob':
            # Custom mappings for COBIT
            template_content = template_content.replace('cob-two', 'sej-grid two')
            template_content = template_content.replace('cob-domains', 'sej-hotspots')
            template_content = template_content.replace('cob-step', 'sej-mini')
            template_content = template_content.replace('cob-factor-grid', 'sej-cards')
            template_content = template_content.replace('cob-type-grid', 'sej-pillar-grid')
            template_content = template_content.replace('cob-type-card', 'sej-pillar')
            
        elif prefix == 'pbi':
            # Custom mappings for PBI
            template_content = template_content.replace('pbi-board', 'sej-list')
            template_content = template_content.replace('pbi-refcard', 'sej-item')
            template_content = template_content.replace('pbi-ref-top', 'sej-item-top')
            template_content = template_content.replace('pbi-ref-meta', 'sej-item-meta')
            template_content = template_content.replace('pbi-scope-grid', 'sej-mini-row')
            template_content = template_content.replace('pbi-scope', 'sej-mini')
            template_content = template_content.replace('pbi-domain-grid', 'sej-pillar-grid')
            template_content = template_content.replace('pbi-domain', 'sej-pillar')
            template_content = template_content.replace('pbi-grid two', 'sej-grid two')
            template_content = template_content.replace('pbi-refs', 'sej-refs')
            template_content = template_content.replace('pbi-ref', 'sej-ref')
            template_content = template_content.replace('pbi-plain', 'sej-plain')
            
        # General prefix replacement
        template_content = template_content.replace(f'{prefix}-', 'sej-')
        template_content = template_content.replace(f'{prefix} ', 'sej- ')
        
        # Put template back
        content = content[:template_match.start()] + template_content + content[template_match.end():]
        
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

# Get Seojk.vue style
with open('src/views/Seojk.vue', 'r', encoding='utf-8') as f:
    sej_content = f.read()
    style_match = re.search(r'<style scoped>(.*?)</style>', sej_content, flags=re.DOTALL)
    if style_match:
        style_content = style_match.group(1).strip()
        
        process_file('src/views/Cobit.vue', style_content, 'cob')
        process_file('src/views/Pbi.vue', style_content, 'pbi')
        print('Files processed successfully.')
    else:
        print('Style not found in Seojk.vue')
