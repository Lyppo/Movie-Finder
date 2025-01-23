from kivy.app import App
from kivy.uix.image import Image
from kivy.uix.floatlayout import FloatLayout
from kivy.uix.button import Button
from kivy.animation import Animation
from kivy.core.window import Window
from kivy.config import Config
from screeninfo import get_monitors
from PIL import Image as Img

# Constants de configuration
IMAGE_RATIO = 2 / 3
IMAGE_RATIO_LARGEUR = 0.5
IMAGES_PATH = "Images/"
DEFAULT_IMAGE = "Default"
EXTENTION_IMG = ".png"
SCREEN_WIDTH = get_monitors()[0].width
SCREEN_HEIGHT = get_monitors()[0].height

def configure_app():
    # Appliquer les configurations de fenêtre
    Window.size = (SCREEN_WIDTH, SCREEN_HEIGHT)  # Définir la taille de la fenêtre
    Window.fullscreen = False  # Passer en mode plein écran
    Window.borderless = False  # Enlever la bordure de la fenêtre
    Window.resizable = True  # Rendre la fenêtre non redimensionnable
    Window.multisamples = 8  # Appliquer l'anti-aliasing

def redimensionner_image(dossier, img):
    # Ouvrir l'image à partir du fichier
    image = Img.open(dossier + img)

    height = SCREEN_HEIGHT*IMAGE_RATIO_LARGEUR
    
    # Redimensionner l'image
    image_redimensionnee = image.resize((int(height*IMAGE_RATIO), int(height)))  # Nouveau taille (largeur, hauteur)
    
    # Sauvegarder l'image redimensionnée dans un nouveau fichier
    image_redimensionnee.save("Resize/" + img)

def create_image(image=DEFAULT_IMAGE, extention=EXTENTION_IMG, dossier=IMAGES_PATH):            # redimentionner l'image a la bonne taille avant pour éviter une app trop lente
    """Crée une image avec un format responsive."""
    img = image+extention
    redimensionner_image(dossier, img)

    return Image(
        source="Resize/"+image+extention,
        size_hint=(IMAGE_RATIO_LARGEUR, IMAGE_RATIO_LARGEUR * IMAGE_RATIO),  # Taille relative (ajustable)
        pos_hint={'center_x': 0.5, 'center_y': 0.5}  # Centrée
    )

def create_close_button(app_instance):
    """Crée un bouton de fermeture pour l'application."""
    close_button = Button(
        text="X",  # Texte de la croix
        size_hint=(0.03, 0.03),  # Taille relative du bouton
        pos_hint={'right': 0.99, 'top': 0.98},  # Décalage du bord droit et du bord supérieur
        background_color=(1, 0, 0, 1),  # Couleur rouge
        color=(1, 1, 1, 1)  # Couleur du texte (blanc)
    )

    # Fonction pour fermer l'application lorsque le bouton est pressé
    close_button.bind(on_press=app_instance.stop)

    return close_button

class MouvieApp(App):
    def build(self):
        # Création du layout
        self.layout = FloatLayout()

        # Crée l'image via la fonction séparée
        self.image = create_image()
        self.layout.add_widget(self.image)

        # Ajouter le bouton de fermeture via la fonction
        close_button = create_close_button(self)
        self.layout.add_widget(close_button)

        # Lier l'événement de la touche (dès que la fenêtre a le focus)
        Window.bind(on_key_down=self.on_key_down)

        # Retourner le layout
        return self.layout

    def on_key_down(self, window, key, *args):
        """
        Gestionnaire d'événement pour les touches du clavier.
        """
        if key == 276:  # Flèche gauche (code de touche Kivy)
            self.handle_left_arrow()
        elif key == 275:  # Flèche droite (code de touche Kivy)
            self.handle_right_arrow()

    def handle_left_arrow(self):
        """
        Action exécutée lorsqu'on appuie sur la flèche gauche.
        """
        print("Flèche gauche pressée")
        self.move_image(True)  # Appel avec 'True' pour tourner à gauche

    def handle_right_arrow(self):
        """
        Action exécutée lorsqu'on appuie sur la flèche droite.
        """
        print("Flèche droite pressée")
        self.move_image(False)  # Appel avec 'False' pour tourner à droite

    def move_image(self, gauche):
        """
        Déplace l'image en fonction de l'argument gauche.
        Si gauche est True, déplace l'image vers la gauche.
        Si gauche est False, déplace l'image vers la droite.
        """
        # Créer l'animation pour le déplacement horizontal
        animation = Animation(
            pos_hint={'center_x': 0.5 + (-0.2 if gauche else 0.2)},  # Animation de déplacement horizontal
            duration=0.5,  # Durée de l'animation en secondes
            opacity=0
        )

        animation += Animation(
            pos_hint={'center_x': 0.5},  # Animation de déplacement horizontal
            duration=0.1,  # Durée de l'animation en secondes
        )

        animation += Animation(
            duration=0.2,  # Durée de l'animation en secondes
            opacity=1
        )

        # Démarrer l'animation sur l'image
        animation.start(self.image)

if __name__ == "__main__":
    configure_app()
    MouvieApp().run()
    