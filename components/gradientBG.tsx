import React, { useEffect, useRef, useState } from "react";
import { NeatConfig, NeatGradient } from "@firecms/neat";
import styles from '/styles/Login.module.css';

export const GradientBG: React.FC = () => {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const gradientRef = useRef<NeatGradient | null>(null);

    useEffect(() => {

        if (!canvasRef.current)
            return;

        gradientRef.current = new NeatGradient({
            ref: canvasRef.current,
                            "colors": [
                                                      {
                                                          "color": "#CCCCCC",
                                                          "enabled": true
                                                      },
                                                      {
                                                          "color": "#CCCCCC",
                                                          "enabled": true
                                                      },
                                                      {
                                                          "color": "#FDC91C",
                                                          "enabled": true
                                                      },
                                                      {
                                                          "color": "#FDC91C",
                                                          "enabled": true
                                                      },
                                                      {
                                                          "color": "#FDC91C",
                                                          "enabled": false
                                                      }
                                                  ],
                                                  "speed": 4,
                                                  "horizontalPressure": 4,
                                                  "verticalPressure": 5,
                                                  "waveFrequencyX": 2,
                                                  "waveFrequencyY": 3,
                                                  "waveAmplitude": 5,
                                                  "shadows": 0,
                                                  "highlights": 2,
                                                  "colorBrightness": 1,
                                                  "colorSaturation": 7,
                                                  "wireframe": false,
                                                  "colorBlending": 6,
                                                  "backgroundColor": "#003FFF",
                                                  "backgroundAlpha": 1,
                                                  "resolution": 1
                                              });

        return gradientRef.current.destroy;

    }, [canvasRef.current]);

    return (
        <canvas
            className={styles.bgColor}
            style={{
                isolation: "isolate",
                height: "100%",
                width: "100%",
            }}
            ref={canvasRef}
        />
    );
};