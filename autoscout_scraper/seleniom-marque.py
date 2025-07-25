from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
import json
import time

def setup_driver():
    """Configure et retourne le driver Chrome avec interface visible"""
    chrome_options = Options()
    # Suppression du mode headless pour voir le navigateur
    # chrome_options.add_argument("--headless")  
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--start-maximized")
    
    driver = webdriver.Chrome(options=chrome_options)
    return driver

def highlight_element(driver, element, color="red", duration=2):
    """Surligne un élément avec une couleur spécifique"""
    original_style = element.get_attribute("style")
    
    # Appliquer le surlignage
    driver.execute_script(
        f"arguments[0].style.border='3px solid {color}'; arguments[0].style.backgroundColor='rgba(255,0,0,0.2)';",
        element
    )
    
    # Faire défiler vers l'élément pour qu'il soit visible
    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", element)
    
    # Attendre pour que l'utilisateur voie le surlignage
    time.sleep(duration)
    
    # Restaurer le style original
    driver.execute_script(f"arguments[0].style='{original_style}';", element)

def show_notification(driver, message, duration=3):
    """Affiche une notification en overlay sur la page"""
    notification_script = f"""
    var notification = document.createElement('div');
    notification.innerHTML = '{message}';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff4444;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        font-family: Arial, sans-serif;
        font-size: 14px;
        font-weight: bold;
        z-index: 10000;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        max-width: 300px;
        word-wrap: break-word;
    `;
    document.body.appendChild(notification);
    
    setTimeout(function() {{
        if (notification.parentNode) {{
            notification.parentNode.removeChild(notification);
        }}
    }}, {duration * 1000});
    """
    driver.execute_script(notification_script)

def get_brands_and_models():
    """Récupère toutes les marques et leurs modèles depuis AutoScout24 avec visualisation"""
    driver = setup_driver()
    brands_models = {}
    
    try:
        # Accéder à la page AutoScout24
        print("Accès à la page AutoScout24...")
        show_notification(driver, "🚀 Début du scraping AutoScout24...")
        driver.get("https://www.autoscout24.fr/")
        
        # Attendre que la page se charge
        wait = WebDriverWait(driver, 15)
        time.sleep(3)  # Laisser le temps de voir la page se charger
        
        # Localiser le select des marques
        show_notification(driver, "🔍 Recherche du sélecteur de marques...")
        make_select_element = wait.until(
            EC.presence_of_element_located((By.ID, "make"))
        )
        
        # Surligner le select des marques
        highlight_element(driver, make_select_element, "red", 3)
        show_notification(driver, "✅ Sélecteur de marques trouvé!")
        
        make_select = Select(make_select_element)
        
        # Localiser le select des modèles
        model_select_element = driver.find_element(By.ID, "model")
        highlight_element(driver, model_select_element, "blue", 2)
        show_notification(driver, "✅ Sélecteur de modèles trouvé!")
        
        total_brands = len(make_select.options) - 1
        print(f"Nombre de marques trouvées : {total_brands}")
        show_notification(driver, f"📊 {total_brands} marques trouvées")
        
        # Parcourir toutes les marques (en excluant la première option vide)
        for i, option in enumerate(make_select.options[1:], 1):
            brand_name = option.text
            brand_value = option.get_attribute('value')
            
            if not brand_name or brand_name in ['Top Marques', 'Autres Marques']:
                continue
                
            print(f"Traitement de la marque {i}/{total_brands}: {brand_name}")
            show_notification(driver, f"🚗 Marque {i}/{total_brands}: {brand_name}")
            
            try:
                # Surligner l'option de marque avant de la sélectionner
                highlight_element(driver, option, "green", 1)
                
                # Sélectionner la marque
                make_select.select_by_value(brand_value)
                
                # Attendre que les modèles se chargent
                show_notification(driver, f"⏳ Chargement des modèles pour {brand_name}...")
                time.sleep(3)
                
                # Attendre que le select des modèles soit mis à jour et ne soit plus disabled
                wait.until(
                    lambda driver: not model_select_element.get_attribute("disabled")
                )
                
                # Surligner le select des modèles une fois mis à jour
                highlight_element(driver, model_select_element, "orange", 1)
                
                # Récupérer les modèles pour cette marque
                model_select = Select(model_select_element)
                models = []
                
                for model_option in model_select.options[1:]:  # Exclure l'option vide
                    model_name = model_option.text.strip()
                    if model_name and not model_name.startswith('&nbsp;'):
                        # Nettoyer le nom du modèle des espaces non-sécables
                        model_name = model_name.replace('\u00a0', ' ').strip()
                        models.append(model_name)
                
                brands_models[brand_name] = {
                    'brand_value': brand_value,
                    'models': models,
                    'model_count': len(models)
                }
                
                print(f"  → {len(models)} modèles trouvés pour {brand_name}")
                show_notification(driver, f"✅ {len(models)} modèles trouvés pour {brand_name}")
                
                # Petit délai pour voir les résultats
                time.sleep(1)
                
            except Exception as e:
                print(f"Erreur lors du traitement de {brand_name}: {str(e)}")
                show_notification(driver, f"❌ Erreur pour {brand_name}")
                brands_models[brand_name] = {
                    'brand_value': brand_value,
                    'models': [],
                    'model_count': 0,
                    'error': str(e)
                }
                time.sleep(2)
                continue
    
    except Exception as e:
        print(f"Erreur générale: {str(e)}")
        show_notification(driver, f"❌ Erreur générale: {str(e)}")
    
    finally:
        show_notification(driver, "🏁 Scraping terminé! Fermeture dans 10 secondes...")
        time.sleep(10)  # Laisser le temps de voir le résultat final
        driver.quit()
    
    return brands_models

def save_to_json(data, filename="autoscout24_brands_models.json"):
    """Sauvegarde les données dans un fichier JSON"""
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Données sauvegardées dans {filename}")

def print_summary(data):
    """Affiche un résumé des données récupérées"""
    total_brands = len(data)
    total_models = sum(brand_info['model_count'] for brand_info in data.values())
    
    print("\n" + "="*50)
    print("RÉSUMÉ")
    print("="*50)
    print(f"Nombre total de marques: {total_brands}")
    print(f"Nombre total de modèles: {total_models}")
    print("\nTop 10 des marques avec le plus de modèles:")
    
    # Trier les marques par nombre de modèles
    sorted_brands = sorted(data.items(), key=lambda x: x[1]['model_count'], reverse=True)
    
    for i, (brand, info) in enumerate(sorted_brands[:10], 1):
        print(f"{i:2d}. {brand}: {info['model_count']} modèles")
    
    print("\nExemple de modèles pour Mercedes-Benz:")
    if 'Mercedes-Benz' in data:
        for i, model in enumerate(data['Mercedes-Benz']['models'][:10], 1):
            print(f"    {i}. {model}")
        if len(data['Mercedes-Benz']['models']) > 10:
            print(f"    ... et {len(data['Mercedes-Benz']['models']) - 10} autres modèles")

def run_with_demo_mode():
    """Mode démo pour voir les actions en temps réel"""
    print("🎬 MODE DÉMONSTRATION ACTIVÉ")
    print("=" * 50)
    print("Le navigateur va s'ouvrir et vous pourrez voir:")
    print("• Les éléments surlignés en ROUGE/VERT/BLEU/ORANGE")
    print("• Les notifications en temps réel en haut à droite")
    print("• Le défilement automatique vers les éléments")
    print("• Les actions de Selenium étape par étape")
    print("=" * 50)
    input("Appuyez sur Entrée pour commencer la démonstration...")
    
    return get_brands_and_models()

if __name__ == "__main__":
    print("Scraper AutoScout24 avec visualisation en temps réel")
    print("1. Mode normal (rapide)")
    print("2. Mode démonstration (avec visualisation)")
    
    choice = input("Choisissez votre mode (1 ou 2): ").strip()
    
    if choice == "2":
        brands_models_data = run_with_demo_mode()
    else:
        brands_models_data = get_brands_and_models()
    
    # Sauvegarder dans un fichier JSON
    save_to_json(brands_models_data)
    
    # Afficher le résumé
    print_summary(brands_models_data)
    
    print("\nScraping terminé !")