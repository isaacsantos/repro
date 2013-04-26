#include <QApplication>
#include "html5applicationviewer.h"

int main(int argc, char *argv[])
{
    QApplication app(argc, argv);


    Html5ApplicationViewer viewer;

    viewer.setOrientation(Html5ApplicationViewer::ScreenOrientationAuto);
    viewer.setFixedSize(640, 480);
    viewer.showExpanded();
    viewer.loadFile(QLatin1String("html/index.html"));

    return app.exec();
}
