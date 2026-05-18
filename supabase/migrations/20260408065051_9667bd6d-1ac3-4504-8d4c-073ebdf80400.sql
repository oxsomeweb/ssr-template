UPDATE services
SET feature_groups = '[
  {"label": "Coating Options", "items": ["3-4 Year Ceramic Coating — ideal for daily drivers", "5-10 Year Ceramic Coating — maximum long-term protection", "Wheel & caliper ceramic coating add-on available"]},
  {"label": "Protection & Benefits", "items": ["Extreme hydrophobic water beading & sheeting", "UV protection to prevent paint oxidation & fading", "Chemical resistance against bird droppings, tree sap & road salt", "High-gloss, mirror-like finish that lasts for years"]}
]'::jsonb
WHERE id = '4b4a60e4-f5ae-4cde-9a8e-4471187429ec';