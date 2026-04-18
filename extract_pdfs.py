import PyPDF2
import sys
import os

def extract_pdf_to_text(pdf_path, txt_path):
    try:
        if not os.path.exists(pdf_path):
            print(f"File not found: {pdf_path}")
            return
            
        with open(pdf_path, "rb") as file:
            reader = PyPDF2.PdfReader(file)
            text = ""
            for page_num in range(len(reader.pages)):
                page = reader.pages[page_num]
                text += f"\\n--- PAGE {page_num+1} ---\\n"
                page_text = page.extract_text()
                if page_text:
                    text += page_text
                    
            with open(txt_path, "w", encoding="utf-8") as out:
                out.write(text)
            print(f"Successfully extracted {pdf_path} to {txt_path}")
    except Exception as e:
        print(f"Error handling {pdf_path}: {e}")

if __name__ == "__main__":
    pdf1 = r"C:\laragon\www\sonarqube-CE\202512 - OWASP Top 10 2025 by Miglen Evlogiev.pdf"
    pdf2 = r"C:\laragon\www\sonarqube-CE\OWASP_Application_Security_Verification_Standard_5.0.0_en.pdf"
    
    extract_pdf_to_text(pdf1, "top10_extracted.txt")
    extract_pdf_to_text(pdf2, "asvs_extracted.txt")
